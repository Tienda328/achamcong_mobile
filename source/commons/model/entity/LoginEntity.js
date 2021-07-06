import * as schema from './Schema'

const LoginEntity = {
    name: schema.LOGIN_TABLE,
    primaryKey: 'id',
    properties: {
        id: { type: 'int?' },
        email: { type: 'string?', default: '' },
        email_verified_at: { type: 'string?', default: '' },
        name: { type: 'string?', default: '' },
        address: { type: 'string?', default: '' },
        // salary: { type: 'int', default: 0 },
        // date_free: { type: 'int', default: 0 },
        phone: { type: 'string?', default: '' },
        zalo: { type: 'string?', default: '' },
        birth_day: { type: 'string?', default: '' },
        facebook: { type: 'string?', default: '' },
        avatar: { type: 'string?', default: '' },
        permission: { type: 'int?', default: 3 },
        sex: { type: 'int?', default: 1 },
        id_department: { type: 'string?', default: '' },
        id_cpny: { type: 'int?', default: 1 },
        id_branch: { type: 'string?', default: '' },
        role: { type: 'string?', default: '' },
        // id_shift: { type: 'int?', default: 1 },
        // date: { type: 'string?', default: '' },
        image_sample: { type: 'string?', default: "" }, // da cap nhat anh
        // lang: { type: 'string?', default: '' },
        active_location: { type: 'int?', default: 0 },
        access_token: { type: 'string?', default: '' },
        token_type: { type: 'string?', default: '' },
        expires_at: { type: 'string?', default: '' },

        created_at: { type: 'string?', default: '' },
        updated_at: { type: 'string?', default: '' },
        shift: { type: 'SHIFT_LOGIN_TABLE[]' },
        isSavePass: { type: 'bool', default: false },
        isCheckinFromFaceId: { type: 'bool', default: false },
        idCheckInFaceId: { type: 'string?', default: "" },



        // work_schedule: { type: 'string?', default: '' },
        // time_start: { type: 'string?', default: '' },
        // time_end: { type: 'string?', default: '' },
        // checkin: { type: 'string?', default: '' },
        // checkout: { type: 'string?', default: '' },
        // active_ip: { type: 'int?', default: 0 },
        // active_location: { type: 'int?', default: 0 },
        // overnight: { type: 'int?', default: 0 },
        // id_cpny: { type: 'int?', default: 0 },
        // mid_start: { type: 'string?', default: '' },
        // mid_end: { type: 'string?', default: '' },
        // name: { type: 'string?', default: '' },
        // created_at: { type: 'string?', default: '' },
        // updated_at: { type: 'string?', default: '' },
        // deadline_end: { type: 'int?', default: 0 },
        // deadline_start: { type: 'int?', default: 0 },
    }
}

export default LoginEntity