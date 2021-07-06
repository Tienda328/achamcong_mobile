import * as schema from './Schema';

const SettingEntity = {
  name: schema.SETTING_TABLE,
  primaryKey: 'id',
  properties: {
    id: {type: 'int?'},
    content: {type: 'string', default: ''},
  },
};

export default SettingEntity;
