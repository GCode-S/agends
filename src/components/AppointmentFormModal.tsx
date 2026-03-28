import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { AppointmentDraft } from '../types/appointment'

interface AppointmentFormModalProps {
  open: boolean
  initialDate: string
  initialDraft?: AppointmentDraft
  title?: string
  description?: string
  submitText?: string
  onClose: () => void
  onSubmit: (payload: AppointmentDraft) => Promise<void>
}

const initialFormState = (date: string): AppointmentDraft => ({
  clientName: '',
  date,
  time: '09:00',
})

export function AppointmentFormModal({
  open,
  initialDate,
  initialDraft,
  title = 'Novo agendamento',
  description = 'Crie o compromisso com nome, data e hora.',
  submitText = 'Salvar agendamento',
  onClose,
  onSubmit,
}: AppointmentFormModalProps) {
  const [form, setForm] = useState<AppointmentDraft>(initialDraft ?? initialFormState(initialDate))

  const updateField = <K extends keyof AppointmentDraft>(key: K, value: AppointmentDraft[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleOpenChange = (): void => {
    if (!open) {
      setForm(initialDraft ?? initialFormState(initialDate))
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    if (!form.clientName.trim()) {
      return
    }

    await onSubmit(form)
    setForm(initialFormState(form.date))
  }

  return (
    <AnimatePresence onExitComplete={handleOpenChange}>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 grid place-items-end bg-zinc-950/45 p-0 sm:p-3 sm:place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.form
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-rose-100 bg-white p-4 shadow-[0_22px_60px_rgba(190,24,93,.25)] sm:rounded-3xl sm:p-5"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onClick={(event) => event.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-zinc-200 sm:hidden" />
            <h2 className="font-title text-3xl text-zinc-900">{title}</h2>
            <p className="mt-1 text-sm text-zinc-600">{description}</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-1 block text-sm font-medium text-zinc-700">Nome da cliente</span>
                <input
                  required
                  value={form.clientName}
                  onChange={(event) => updateField('clientName', event.target.value)}
                  className="w-full rounded-2xl border border-rose-200 bg-white px-3 py-2.5 outline-none ring-0 transition focus:border-rose-400"
                  placeholder="Ex.: Ana Paula"
                />
              </label>

              <label>
                <span className="mb-1 block text-sm font-medium text-zinc-700">Data</span>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(event) => updateField('date', event.target.value)}
                  className="w-full rounded-2xl border border-rose-200 bg-white px-3 py-2.5 outline-none ring-0 transition focus:border-rose-400"
                />
              </label>

              <label>
                <span className="mb-1 block text-sm font-medium text-zinc-700">Hora</span>
                <input
                  type="time"
                  required
                  value={form.time}
                  onChange={(event) => updateField('time', event.target.value)}
                  className="w-full rounded-2xl border border-rose-200 bg-white px-3 py-2.5 outline-none ring-0 transition focus:border-rose-400"
                />
              </label>

            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-rose-50"
              >
                Cancelar
              </button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="rounded-full bg-linear-to-r from-rose-500 to-pink-600 px-5 py-2 text-sm font-semibold text-white"
              >
                {submitText}
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
