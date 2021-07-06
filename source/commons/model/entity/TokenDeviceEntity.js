import * as schema from './Schema';

const TokenDevicesEntity = {
  name: schema.TOKEN_DEVICE,
  primaryKey: 'id',
  properties: {
    id: {type: 'int?'},
    token_device: {type: 'string?', default: ''},
  },
};

export default TokenDevicesEntity;
