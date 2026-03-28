import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AnimatePresence, motion } from 'motion/react'
import { toDateKey } from '../lib/date'
import type { Appointment } from '../types/appointment'

interface ReminderModalProps {
  open: boolean
  reminders: Appointment[]
  onClose: () => void
}

export function ReminderModal({ open, reminders, onClose }: ReminderModalProps) {
  const today = toDateKey(new Date())

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-end bg-zinc-950/40 p-0 sm:place-items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md rounded-t-3xl border border-rose-200 bg-white p-4 shadow-[0_25px_65px_rgba(190,24,93,.28)] sm:rounded-3xl sm:p-5"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-zinc-200 sm:hidden" />
            <h3 className="font-title text-2xl text-zinc-900 sm:text-3xl">Lembrete de agenda</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Você tem compromissos para hoje ou amanhã. Confira antes de iniciar o dia.
            </p>

            <div className="mt-4 space-y-2.5">
              {reminders.map((appointment) => {
                const date = parseISO(appointment.startAt)
                const dateKey = toDateKey(date)
                const dayLabel = dateKey === today ? 'Hoje' : 'Amanhã'

                return (
                  <div
                    key={appointment.id}
                    className="rounded-2xl border border-rose-100 bg-rose-50/50 px-3 py-2"
                  >
                    <p className="text-sm font-semibold text-zinc-900">{appointment.clientName}</p>
                    <p className="text-xs text-zinc-600">
                      {dayLabel} • {format(date, "HH:mm ' - ' dd/MM", { locale: ptBR })}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="mt-5 flex justify-end">
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                className="rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-5 py-2 text-sm font-semibold text-white"
              >
                Entendi
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
