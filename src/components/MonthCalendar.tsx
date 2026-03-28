import { getDay, isSameDay, startOfMonth } from 'date-fns'
import { motion } from 'motion/react'
import { monthDays, toDateKey } from '../lib/date'

interface MonthCalendarProps {
  selectedDate: Date
  markedDateKeys: Set<string>
  onPick: (date: Date) => void
}

const weekHeadersDesktop = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM']
const weekHeadersMobile = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']

export function MonthCalendar({ selectedDate, markedDateKeys, onPick }: MonthCalendarProps) {
  const days = monthDays(selectedDate)
  // Convert Sunday-based index (0-6) to Monday-first calendar index (0-6).
  const firstDayOffset = (getDay(startOfMonth(selectedDate)) + 6) % 7
  const emptySlots = Array.from({ length: firstDayOffset })

  return (
    <div className="rounded-3xl border border-rose-100 bg-white/70 p-2.5 shadow-[0_14px_35px_rgba(190,24,93,.08)] backdrop-blur sm:p-4">
      <div className="mb-2.5 grid grid-cols-7 gap-1 sm:mb-3 sm:gap-2">
        {weekHeadersDesktop.map((header, index) => (
          <p
            key={header}
            className="text-center text-[10px] font-semibold text-zinc-500 sm:text-[11px] sm:tracking-[0.14em]"
          >
            <span className="sm:hidden">{weekHeadersMobile[index]}</span>
            <span className="hidden sm:inline">{header}</span>
          </p>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {emptySlots.map((_, index) => (
          <span
            key={`empty-${index}`}
            aria-hidden="true"
            className="block h-9 rounded-lg sm:h-11 sm:rounded-xl"
          />
        ))}

        {days.map((date) => {
          const active = isSameDay(selectedDate, date)
          const hasAppointment = markedDateKeys.has(toDateKey(date))

          return (
            <motion.button
              key={date.toISOString()}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => onPick(date)}
              className={[
                'relative h-9 rounded-lg border text-xs font-semibold transition-all sm:h-11 sm:rounded-xl sm:text-sm',
                active
                  ? 'border-rose-500 bg-rose-500 text-white shadow-[0_8px_20px_rgba(225,29,72,.28)]'
                  : 'border-rose-100 bg-white text-zinc-700 hover:border-rose-300 hover:text-zinc-900',
              ].join(' ')}
              aria-label={`Selecionar dia ${date.getDate()}`}
            >
              {date.getDate()}
              {hasAppointment && (
                <span
                  className={[
                    'absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full sm:h-1.5 sm:w-1.5',
                    active ? 'bg-white' : 'bg-rose-500',
                  ].join(' ')}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
