import {
  addDays,
  format,
  isSameDay,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const toDateKey = (date: Date): string => format(date, 'yyyy-MM-dd')

export const toDateTimeString = (date: Date): string => format(date, "yyyy-MM-dd'T'HH:mm")

export const formatMonthLabel = (date: Date): string =>
  format(date, "MMMM 'de' yyyy", { locale: ptBR })

export const formatWeekdayLabel = (date: Date): string =>
  format(date, 'EEE', { locale: ptBR }).replace('.', '').toUpperCase()

export const formatClock = (isoDate: string): string =>
  format(parseISO(isoDate), 'HH:mm')

export const formatDateLong = (date: Date): string =>
  format(date, "EEEE, d 'de' MMMM", { locale: ptBR })

export const monthDays = (baseDate: Date): Date[] =>
  eachDayOfInterval({
    start: startOfMonth(baseDate),
    end: endOfMonth(baseDate),
  })

export const isTodayOrTomorrow = (date: Date): boolean => {
  const today = new Date()
  const tomorrow = addDays(today, 1)
  return isSameDay(date, today) || isSameDay(date, tomorrow)
}
