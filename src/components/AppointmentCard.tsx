import { Pencil, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { formatClock } from '../lib/date'
import type { Appointment } from '../types/appointment'

interface AppointmentCardProps {
  appointment: Appointment
  onEdit: (appointment: Appointment) => void
  onDelete: (appointment: Appointment) => void
}

export function AppointmentCard({ appointment, onEdit, onDelete }: AppointmentCardProps) {
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
