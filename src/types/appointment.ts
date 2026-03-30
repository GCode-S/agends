export interface Appointment {
  id?: number
  clientName: string
  startAt: string
  createdAt: string
  isPaid: boolean
}

export interface AppointmentDraft {
  clientName: string
  date: string
  time: string
}
