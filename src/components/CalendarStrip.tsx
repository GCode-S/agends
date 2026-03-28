import { isSameDay } from 'date-fns'
import { motion } from 'motion/react'
import { formatWeekdayLabel, toDateKey } from '../lib/date'

interface CalendarStripProps {
  dates: Date[]
  selectedDate: Date
  markedDateKeys: Set<string>
  onPick: (date: Date) => void
}

export function CalendarStrip({ dates, selectedDate, markedDateKeys, onPick }: CalendarStripProps) {
  return (
    <div
      className="grid gap-2 pb-1.5 sm:gap-3 sm:pb-2"
      style={{ gridTemplateColumns: `repeat(${dates.length}, minmax(0, 1fr))` }}
    >
      {dates.map((date) => {
        const active = isSameDay(selectedDate, date)
        const hasAppointment = markedDateKeys.has(toDateKey(date))

        return (
          <motion.button
            key={date.toISOString()}
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => onPick(date)}
            className={[
              'group relative min-h-24 w-full rounded-2xl border px-2 py-2.5 text-center transition-all sm:min-h-28 sm:rounded-3xl sm:px-3 sm:py-3',
              active
                ? 'border-rose-500 bg-linear-to-b from-rose-500 to-pink-600 text-white shadow-[0_10px_26px_rgba(225,29,72,.35)]'
                : 'border-rose-100 bg-white/80 text-zinc-800 hover:border-rose-300 hover:bg-white',
            ].join(' ')}
          >
            <p className={['text-[10px] font-semibold tracking-[0.16em] sm:text-xs sm:tracking-[0.18em]', active ? 'text-white/90' : 'text-zinc-500'].join(' ')}>
              {formatWeekdayLabel(date)}
            </p>
            <p className="mt-1 text-2xl font-bold leading-none sm:text-3xl">{date.getDate()}</p>
            {hasAppointment && (
              <span
                className={[
                  'mx-auto mt-2 block h-2 w-2 rounded-full',
                  active ? 'bg-white' : 'bg-rose-500',
                ].join(' ')}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
