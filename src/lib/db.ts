import Dexie, { type EntityTable } from 'dexie'
import type { Appointment } from '../types/appointment'

class AgendaDatabase extends Dexie {
  appointments!: EntityTable<Appointment, 'id'>

  constructor() {
    super('agenda-db')
    this.version(1).stores({
      appointments: '++id,startAt,clientName',
    })
  }
}

export const db = new AgendaDatabase()
