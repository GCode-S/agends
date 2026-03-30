import Dexie, { type EntityTable } from 'dexie'
import type { Appointment } from '../types/appointment'

class AgendaDatabase extends Dexie {
  appointments!: EntityTable<Appointment, 'id'>

  constructor() {
    super('agenda-db')
    this.version(1).stores({
      appointments: '++id,startAt,clientName',
    })

    this.version(2)
      .stores({
        appointments: '++id,startAt,clientName,isPaid',
      })
      .upgrade(async (tx) => {
        await tx
          .table<Appointment, 'id'>('appointments')
          .toCollection()
          .modify((appointment) => {
            if (typeof appointment.isPaid !== 'boolean') {
              appointment.isPaid = false
            }
          })
      })
  }
}

export const db = new AgendaDatabase()
