import { useEffect, useMemo, useState } from 'react'
import { addDays, format, isSameDay, parseISO } from 'date-fns'
import { CalendarPlus, Sparkles, Wifi, WifiOff } from 'lucide-react'
import { motion } from 'motion/react'
import { AppointmentCard } from './components/AppointmentCard'
import { ConfirmDangerModal } from './components/ConfirmDangerModal.tsx'
import { AppointmentFormModal } from './components/AppointmentFormModal'
import { CalendarStrip } from './components/CalendarStrip'
import { MonthCalendar } from './components/MonthCalendar'
import { ReminderModal } from './components/ReminderModal'
import { formatDateLong, formatMonthLabel, toDateKey } from './lib/date'
import { useAgendaStore } from './store/useAgendaStore'
import type { Appointment, AppointmentDraft } from './types/appointment'

function App() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)
  const [stripDaysCount, setStripDaysCount] = useState<number>(
    window.innerWidth < 768 ? 4 : 5,
  )
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null)
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState<boolean>(false)

  const {
    appointments,
    selectedDate,
    reminders,
    isFormOpen,
    isReminderOpen,
    initialize,
    setSelectedDate,
    openForm,
    closeForm,
    closeReminder,
    addAppointment,
    updateAppointment,
    setAppointmentPaid,
    deleteAppointment,
    clearAllAppointments,
  } = useAgendaStore()

  useEffect(() => {
    void initialize()
  }, [initialize])

  useEffect(() => {
    const handleOnline = (): void => setIsOnline(true)
    const handleOffline = (): void => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    const handleResize = (): void => {
      setStripDaysCount(window.innerWidth < 768 ? 4 : 5)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const markedDateKeys = useMemo(() => {
    return new Set(appointments.map((appointment) => toDateKey(parseISO(appointment.startAt))))
  }, [appointments])

  const selectedAppointments = useMemo(() => {
    return appointments.filter((appointment) => isSameDay(parseISO(appointment.startAt), selectedDate))
  }, [appointments, selectedDate])

  const weekDates = useMemo(() => {
    return Array.from({ length: stripDaysCount }, (_, index) => addDays(selectedDate, index))
  }, [selectedDate, stripDaysCount])

  const editingDraft = useMemo<AppointmentDraft | undefined>(() => {
    if (!editingAppointment) {
      return undefined
    }

    const date = parseISO(editingAppointment.startAt)
    return {
      clientName: editingAppointment.clientName,
      date: format(date, 'yyyy-MM-dd'),
      time: format(date, 'HH:mm'),
    }
  }, [editingAppointment])

  const handleEditSubmit = async (draft: AppointmentDraft): Promise<void> => {
    if (!editingAppointment?.id) {
      return
    }

    await updateAppointment(editingAppointment.id, draft)
    setEditingAppointment(null)
  }

  const handleDeleteOne = async (): Promise<void> => {
    if (!deletingAppointment?.id) {
      return
    }

    await deleteAppointment(deletingAppointment.id)
    setDeletingAppointment(null)
  }

  const handleTogglePaid = async (appointment: Appointment, isPaid: boolean): Promise<void> => {
    if (!appointment.id) {
      return
    }

    await setAppointmentPaid(appointment.id, isPaid)
  }

  const handleDeleteAll = async (): Promise<void> => {
    await clearAllAppointments()
    setIsDeleteAllOpen(false)
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <div className="pointer-events-none absolute -left-16 top-6 h-44 w-44 rounded-full bg-rose-200/70 blur-3xl sm:-left-10 sm:top-12 sm:h-56 sm:w-56" />
      <div className="pointer-events-none absolute -right-20 top-1 h-52 w-52 rounded-full bg-pink-200/65 blur-3xl sm:-right-14 sm:top-8 sm:h-64 sm:w-64" />

      <div className="mx-auto w-full max-w-7xl">
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 sm:text-sm"
          >
            <WifiOff className="size-4 shrink-0" />
            <span>Modo offline ativo: seus agendamentos continuam disponíveis.</span>
          </motion.div>
        )}

        <motion.header
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl border border-rose-100 bg-white/85 p-4 shadow-[0_22px_50px_rgba(236,72,153,.14)] backdrop-blur sm:p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-zinc-500 sm:text-xs">MY AGENDS</p>
              <h1 className="font-title text-[2.3rem] leading-[0.9] text-zinc-900 sm:text-5xl lg:text-6xl">Agenda das Clientes</h1>
            </div>

            <div className="flex items-center gap-2 self-start">
              <span
                className={[
                  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
                  isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-100 text-rose-700',
                ].join(' ')}
              >
                {isOnline ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
                {isOnline ? 'Online' : 'Offline'}
              </span>

              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={openForm}
                className="hidden items-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(225,29,72,.35)] sm:inline-flex"
              >
                <CalendarPlus className="size-4" />
                Novo
              </motion.button>
            </div>
          </div>
        </motion.header>

        <main className="mt-4 grid gap-4 xl:mt-5 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)] xl:gap-5">
          <section className="min-w-0 space-y-4 xl:sticky xl:top-4 xl:h-fit">
            <motion.article
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="min-w-0 rounded-3xl border border-rose-100 bg-white/88 p-3 shadow-[0_16px_42px_rgba(236,72,153,.1)] backdrop-blur sm:p-4"
            >
              <div className="mb-3.5 flex items-center justify-between gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 sm:text-xs">
                  {formatMonthLabel(selectedDate)}
                </p>
                <p className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 sm:text-xs">
                  {markedDateKeys.size} dias com clientes
                </p>
              </div>

              <CalendarStrip
                dates={weekDates}
                selectedDate={selectedDate}
                markedDateKeys={markedDateKeys}
                onPick={setSelectedDate}
              />

              <div className="mt-3.5">
                <MonthCalendar
                  selectedDate={selectedDate}
                  markedDateKeys={markedDateKeys}
                  onPick={setSelectedDate}
                />
              </div>
            </motion.article>
          </section>

          <section className="rounded-3xl border border-rose-100 bg-white/82 p-3 shadow-[0_20px_48px_rgba(236,72,153,.12)] backdrop-blur sm:p-4 lg:p-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 sm:text-xs">Visao diaria</p>
                <h2 className="mt-1 text-2xl font-semibold leading-tight text-zinc-900 sm:text-3xl">
                  {formatDateLong(selectedDate)}
                </h2>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 sm:text-sm">
                <Sparkles className="size-4" />
                {selectedAppointments.length} agendamento(s)
              </span>
            </motion.div>

            <div className="no-scrollbar space-y-3 pr-1 md:max-h-[56vh] md:overflow-y-auto xl:max-h-[68vh]">
              {selectedAppointments.length > 0 ? (
                selectedAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onTogglePaid={handleTogglePaid}
                    onEdit={setEditingAppointment}
                    onDelete={setDeletingAppointment}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-dashed border-rose-200 bg-white p-5 text-center sm:p-6"
                >
                  <p className="text-base font-semibold text-zinc-800">Nenhum compromisso nesse dia.</p>
                  <p className="mt-1 text-sm text-zinc-600">Toque em Novo para registrar o primeiro atendimento.</p>
                </motion.div>
              )}
            </div>
          </section>
        </main>

        <div className="mt-5 flex justify-center pb-4">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsDeleteAllOpen(true)}
            className="rounded-full border border-rose-200 bg-white px-5 py-2 text-sm font-semibold text-rose-700 shadow-[0_10px_24px_rgba(190,24,93,.12)] transition hover:bg-rose-50"
          >
            Limpar todo o armazenamento
          </motion.button>
        </div>
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={openForm}
        className="fixed bottom-4 right-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-linear-to-r from-rose-600 to-pink-700 text-4xl text-white shadow-[0_16px_30px_rgba(190,24,93,.45)] sm:bottom-5 sm:right-5 sm:size-16 xl:hidden"
        aria-label="Criar agendamento"
      >
        +
      </motion.button>

      <AppointmentFormModal
        key={`create-${toDateKey(selectedDate)}`}
        open={isFormOpen}
        initialDate={toDateKey(selectedDate)}
        onClose={closeForm}
        onSubmit={addAppointment}
      />

      <AppointmentFormModal
        key={`edit-${editingAppointment?.id ?? 'none'}`}
        open={editingAppointment !== null}
        initialDate={toDateKey(selectedDate)}
        initialDraft={editingDraft}
        title="Alterar agendamento"
        description="Altere nome, data e hora do compromisso."
        submitText="Salvar alterações"
        onClose={() => setEditingAppointment(null)}
        onSubmit={handleEditSubmit}
      />

      <ReminderModal open={isReminderOpen} reminders={reminders} onClose={closeReminder} />

      <ConfirmDangerModal
        open={deletingAppointment !== null}
        title="Excluir agendamento"
        description={`Tem certeza que deseja excluir ${deletingAppointment?.clientName ?? 'este agendamento'}?`}
        confirmText="Excluir"
        onCancel={() => setDeletingAppointment(null)}
        onConfirm={handleDeleteOne}
      />

      <ConfirmDangerModal
        open={isDeleteAllOpen}
        title="Apagar todos os dados"
        description="Esta ação remove todos os agendamentos salvos no armazenamento local. Deseja continuar?"
        confirmText="Apagar tudo"
        onCancel={() => setIsDeleteAllOpen(false)}
        onConfirm={handleDeleteAll}
      />
    </div>
  )
}

export default App
