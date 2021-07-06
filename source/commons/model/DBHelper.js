import Realm from 'realm';
import {commonsConfigs as configs} from '../../commons';
import {
  LoginEntity,
  TokenDeviceEntity,
  StatusAdminEntity,
  SettingEntity,
  ShiftLoginEntity,
  AccountEntity,
} from './entity';

export class DbHelper {
  static insertOrUpdate(data, update = false) {
    return new Promise((res, rej) => {
    if (data instanceof Array) {
      realm.write(() => {
        for (let i = 0; i < data.length; i++) {
          realm.create(this.schema.name, data[i], update);
        }
      });
    } else {
      // alert('vao day     ' + JSON.stringify(data))
      realm.write(() => {
        return realm.create(this.schema.name, data, update);
      });
    }
    //resolve Promise
    res(true);
    })
  }

  static getAll() {
    let result = null;
    realm.write(() => {
      // <--
      result = realm.objects(this.schema.name).filter(item => item.id !== null);
    }); //
    return result;
  }

  static getSize() {
    let result = this.getAll();
    return result ? result.length : 0;
  }

  static maxPrimaryKey() {
    let maxPrimaryKey = realm
      .objects(this.schema.name)
      .max(this.schema.primaryKey);
    if (maxPrimaryKey) {
      return maxPrimaryKey + 1;
    }
    return 1;
  }

  static getObjectByPrimaryKey(valueKey) {
    let data = realm
      .objects(this.schema.name)
      .filtered(this.schema.primaryKey + ' =  $0', valueKey);
    if (data) {
      let object = configs.convertToArray(data);
      if (object && object[0]) {
        return object[0];
      }
    }
    return null;
  }

  static deleteAll() {
    realm.write(() => {
      realm.delete(this.getAll());
    });
  }

  static deleteRow(object) {
    realm.write(() => {
      realm.delete(object);
    });
  }

  static getDataByColumn(key, value) {
    try {
      return realm
        .objects(this.schema.name)
        .filtered(key + ' LIKE "*' + value + '*' + '"');
    } catch (error) {
      return [];
    }
  }

  static getData(key, values) {
    return realm.objects(this.schema.name).filtered(key + ' = $0', values);
  }

  static deepCopyObject(objectRaw) {
    if (!objectRaw) {
      return '';
    }
    if (Array.isArray(objectRaw)) {
      let objectArray = Array.from(objectRaw);
      return JSON.parse(JSON.stringify(objectArray));
    }
    return JSON.parse(JSON.stringify(objectRaw));
  }

  setProp(prop, value) {
    realm.write(() => {
      this[prop] = value;
    });
  }
}

class LoginModel extends DbHelper {
  static deleteLogin(isShowMessage = true) {
    let loginInfo = this.getAll();
    console.log('login fỏe:  ' + JSON.stringify(loginInfo));
    let dataLogin = Object.assign({}, loginInfo);
    if (loginInfo) {
      this.deleteRow(loginInfo);
      return true;
    } else {
      if (isShowMessage) {
        alert('Thông tin đăng nhập đã trống trước đó.');
      }
    }
    return false;
  }
  static changeIsCheckInFaceId(isCheck) {
    let updt = realm.objects(this.schema.name);
    realm.write(() => {
      // <--
      updt[0].isCheckinFromFaceId = isCheck;
    }); //
  }
  static changeDataIdCheckInFaceId(data) {
    let updt = realm.objects(this.schema.name);
    realm.write(() => {
      // <--
      updt[0].idCheckInFaceId = data;
    }); //
  }
  static schema = LoginEntity;
}

class TokenDeviceModel extends DbHelper {
  static getTokenModel() {
    let data = this.getAll();
    if (data && data[0] && data[0].token_device) {
      return data[0].token_device;
    }
    return 'Đã có lỗi Đã có lỗi Đã có lỗi Đã có lỗi Đã có lỗi Đã có lỗi Đã có lỗi Đã có lỗi';
  }
  static schema = TokenDeviceEntity;
}

class NotificationModel extends DbHelper {
  static getNotiType() {
    let data = this.getAll();
    if (data && data[0] && data[0].token_device) {
      return data[0].noti_type;
    }
    return 'Không thể lấy loại tho';
  }
}

class StatusAdminModel extends DbHelper {
  static insertStatusAdmin(params) {
    let data = this.getAll();
    // console.log("data[0]:   " + JSON.stringify(data))
    if (data && data[0]) {
      this.insertOrUpdate(params, true);
    } else {
      this.insertOrUpdate(params, false);
    }
  }
  static getStatusAdmin() {
    let data = this.getAll();
    if (data && data[0]) {
      return data[0].statusAdmin;
    }

    return false;
  }
  static schema = StatusAdminEntity;
}

class SettingModel extends DbHelper {
  static insertSetting(params) {
    let data = this.getObjectByPrimaryKey(params.id);
    if (data) {
      this.insertOrUpdate(params, true);
    } else {
      this.insertOrUpdate(params, false);
    }
  }
  static getIntroAppSetting(params) {
    let data = this.getObjectByPrimaryKey(params.id);
    if (data) {
      return data;
    }
    return [];
  }
  static schema = SettingEntity;
}

class AccountModel extends DbHelper {
  static deleteItemAccountLogin(params) {
    // let data = this.getObjectByPrimaryKey(params.nameAccount)
    // // let data = this.getAll()
    // if (data) {
    this.deleteRow(params);
    // }
    // this.insertOrUpdate(params)
    return false;
  }
  static schema = AccountEntity;
}

const realm = new Realm({
  schema: [
    LoginEntity,
    TokenDeviceEntity,
    StatusAdminEntity,
    SettingEntity,
    ShiftLoginEntity,
    AccountEntity,
  ],
  schemaVersion: 15,
  migration: function (oldRealm, newRealm) {
    newRealm.deleteAll();
  },
});

export {
  LoginModel,
  TokenDeviceModel,
  StatusAdminModel,
  SettingModel,
  AccountModel,
};
