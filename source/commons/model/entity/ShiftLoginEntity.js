
import * as schema from './Schema'
const ShiftLoginEntity = {
    name: schema.SHIFT_LOGIN_TABLE,
    properties: {
        id: { type: 'int' },
        work_schedule: { type: 'string' },
        time_start: { type: 'string' },
        time_end: { type: 'string' },
        checkin: { type: 'string' },
        checkout: { type: 'string' },
        active_ip: { type: 'int' },
        active_location: { type: 'int' },
        overnight: { type: 'int' },
        id_cpny: { type: 'int' },
        mid_start: { type: 'string' },
        mid_end: { type: 'string' },
        name: { type: 'string' },
        created_at: { type: 'string', default: '' },
        updated_at: { type: 'string', default: '' },
        deadline_end: { type: 'int' },
        deadline_start: { type: 'int' },
        active_face_recognition: { type: 'int?', default: 0 }, // 1 là châm bang face
    }
}


export default ShiftLoginEntity