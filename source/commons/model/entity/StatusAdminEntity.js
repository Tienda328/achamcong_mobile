import * as schema from './Schema';

const StatusAdminEntity = {
  name: schema.STATUS_ADMIN_TABLE,
  primaryKey: 'id',
  properties: {
    id: {type: 'int?'},
    statusAdmin: {type: 'bool', default: false},
  },
};

export default StatusAdminEntity;
