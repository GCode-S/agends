import { Pencil, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { formatClock } from '../lib/date'
import type { Appointment } from '../types/appointment'

interface AppointmentCardProps {
  appointment: Appointment
  onTogglePaid: (appointment: Appointment, isPaid: boolean) => void
  onEdit: (appointment: Appointment) => void
  onDelete: (appointment: Appointment) => void
}

export function AppointmentCard({ appointment, onTogglePaid, onEdit, onDelete }: AppointmentCardProps) {
  const checkboxId = `appointment-paid-${appointment.id ?? 'new'}`

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -3 }}
      className="rounded-3xl border border-rose-100 bg-white p-3 shadow-[0_12px_28px_rgba(236,72,153,.12)] sm:p-4"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-zinc-900 sm:text-xl">{appointment.clientName}</h3>
          <p className="mt-0.5 text-sm text-zinc-500">Atendimento agendado</p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-700">
          {formatClock(appointment.startAt)}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <label
          htmlFor={checkboxId}
          className="mr-auto inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-emerald-200/70 bg-emerald-50/40 px-2.5 py-1.5"
        >
          <input
            id={checkboxId}
            type="checkbox"
            checked={appointment.isPaid}
            onChange={(event) => onTogglePaid(appointment, event.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="flex h-5 w-5 items-center justify-center rounded-md border border-zinc-300 bg-white text-transparent transition peer-checked:border-emerald-600 peer-checked:bg-emerald-600 peer-checked:text-white"
          >
            ✓
          </span>
          <span className="text-xs font-semibold text-zinc-700">
            {appointment.isPaid ? 'Pagamento confirmado' : 'Pagamento pendente'}
          </span>
        </label>

        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(appointment)}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50"
          aria-label={`Alterar ${appointment.clientName}`}
        >
          <Pencil className="size-3.5" />
          Alterar
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(appointment)}
          className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
          aria-label={`Excluir ${appointment.clientName}`}
        >
          <Trash2 className="size-3.5" />
          Excluir
        </motion.button>
      </div>
    </motion.article>
  )
}
