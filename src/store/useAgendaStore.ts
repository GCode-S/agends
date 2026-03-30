import { addDays, isSameDay, parse, parseISO } from 'date-fns'
import { create } from 'zustand'
import { db } from '../lib/db'
import type { Appointment, AppointmentDraft } from '../types/appointment'

interface AgendaState {
  appointments: Appointment[]
  selectedDate: Date
  reminders: Appointment[]
  isFormOpen: boolean
  isReminderOpen: boolean
  initialize: () => Promise<void>
  setSelectedDate: (date: Date) => void
  openForm: () => void
  closeForm: () => void
  closeReminder: () => void
  addAppointment: (draft: AppointmentDraft) => Promise<void>
  updateAppointment: (id: number, draft: AppointmentDraft) => Promise<void>
  setAppointmentPaid: (id: number, isPaid: boolean) => Promise<void>
  deleteAppointment: (id: number) => Promise<void>
  clearAllAppointments: () => Promise<void>
}

// const seedAppointments = async (): Promise<void> => {
//   const count = await db.appointments.count()
//   if (count > 0) {
//     return
//   }

//   const now = new Date()
//   const tomorrow = addDays(now, 1)

//   await db.appointments.bulkAdd([
//     {
//       clientName: 'Sarah Chen',
//       startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30).toISOString(),
//       createdAt: new Date().toISOString(),
//     },
//     {
//       clientName: 'Elena Rodriguez',
//       startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0).toISOString(),
//       createdAt: new Date().toISOString(),
//     },
//     {
//       clientName: 'Michael Thorne',
//       startAt: new Date(
//         tomorrow.getFullYear(),
//         tomorrow.getMonth(),
//         tomorrow.getDate(),
//         11,
//         0,
//       ).toISOString(),
//       createdAt: new Date().toISOString(),
//     },
//   ])
// }

const computeReminders = (appointments: Appointment[]): Appointment[] => {
  const today = new Date()
  const tomorrow = addDays(today, 1)

  return appointments.filter((appointment) => {
    const date = parseISO(appointment.startAt)
    return isSameDay(date, today) || isSameDay(date, tomorrow)
  })
}

export const useAgendaStore = create<AgendaState>((set, get) => ({
  appointments: [],
  selectedDate: new Date(),
  reminders: [],
  isFormOpen: false,
  isReminderOpen: false,

  initialize: async () => {
    // await seedAppointments()
    const appointments = await db.appointments.orderBy('startAt').toArray()
    const reminders = computeReminders(appointments)

    set({
      appointments,
      reminders,
      isReminderOpen: reminders.length > 0,
    })
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date })
  },

  openForm: () => {
    set({ isFormOpen: true })
  },

  closeForm: () => {
    set({ isFormOpen: false })
  },

  closeReminder: () => {
    set({ isReminderOpen: false })
  },

  addAppointment: async (draft) => {
    const [hours, minutes] = draft.time.split(':').map(Number)
    const date = parse(draft.date, 'yyyy-MM-dd', new Date())
    date.setHours(hours, minutes, 0, 0)

    await db.appointments.add({
      clientName: draft.clientName.trim(),
      startAt: date.toISOString(),
      createdAt: new Date().toISOString(),
      isPaid: false,
    })

    const appointments = await db.appointments.orderBy('startAt').toArray()
    const reminders = computeReminders(appointments)

    set({
      appointments,
      reminders,
      isFormOpen: false,
      isReminderOpen: reminders.length > 0,
    })

    const currentSelectedDate = get().selectedDate
    if (!isSameDay(currentSelectedDate, date)) {
      set({ selectedDate: date })
    }
  },

  updateAppointment: async (id, draft) => {
    const [hours, minutes] = draft.time.split(':').map(Number)
    const date = parse(draft.date, 'yyyy-MM-dd', new Date())
    date.setHours(hours, minutes, 0, 0)

    await db.appointments.update(id, {
      clientName: draft.clientName.trim(),
      startAt: date.toISOString(),
    })

    const appointments = await db.appointments.orderBy('startAt').toArray()
    const reminders = computeReminders(appointments)

    set({
      appointments,
      reminders,
      isReminderOpen: reminders.length > 0,
    })

    const currentSelectedDate = get().selectedDate
    if (!isSameDay(currentSelectedDate, date)) {
      set({ selectedDate: date })
    }
  },

  setAppointmentPaid: async (id, isPaid) => {
    await db.appointments.update(id, { isPaid })

    const appointments = await db.appointments.orderBy('startAt').toArray()
    const reminders = computeReminders(appointments)

    set({
      appointments,
      reminders,
    })
  },

  deleteAppointment: async (id) => {
    await db.appointments.delete(id)

    const appointments = await db.appointments.orderBy('startAt').toArray()
    const reminders = computeReminders(appointments)

    set({
      appointments,
      reminders,
      isReminderOpen: reminders.length > 0,
    })
  },

  clearAllAppointments: async () => {
    await db.appointments.clear()
    set({
      appointments: [],
      reminders: [],
      isReminderOpen: false,
      isFormOpen: false,
    })
  },
}))
