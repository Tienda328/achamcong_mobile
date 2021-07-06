import * as schema from './Schema';

const AccountEntity = {
  name: schema.ACCOUNT_TABLE,
  primaryKey: 'nameAccount',
  properties: {
    nameAccount: {type: 'string?'},
    password: {type: 'string?', default: ''},
  },
};

export default AccountEntity;
