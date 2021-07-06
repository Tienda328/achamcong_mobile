import { Alert, Platform } from 'react-native';
import { commonsConfigs as configs, utils } from '../../commons'
// import { LoginDTO } from './dto'
import { actions } from '../action'
import {
    LoginModel,
    TokenDeviceModel,
    StatusAdminModel,
    SettingModel,
    AccountModel
} from './DBHelper'


export function deleteAllData() {
    return LoginModel.deleteLogin()
}
export function insertOrUpdateDataLogin(data, isReset) {
    data.id_department = data.id_department.toString();
    data.id_branch = data.id_branch.toString();
    data.role = data.role.toString();
    LoginModel.insertOrUpdate(data, isReset)
    return true
}
export function insertOrUpdateTokenDevice(data, isReset) {
    TokenDeviceModel.insertOrUpdate(data, isReset)
    return true
}
export function getSizeLogin() {
    return LoginModel.getSize()
}

export function getDataLogin() {
    let data = LoginModel.getAll()
    if (data && data[0]) {
        return data[0]
    }
    return []
}

export function changeDataIdCheckInFaceId(data) {
    LoginModel.changeDataIdCheckInFaceId(data)
}

export function changeIsCheckInFaceId(data) {
    LoginModel.changeIsCheckInFaceId(data)
}

export function getToken() {
    let data = LoginModel.getAll()
    if (data && data[0]) {
        return data[0].access_token
    }
    return ''
}

export function getEmailLocal() {
    let data = LoginModel.getAll()
    if (data && data[0]) {
        return data[0].email
    }
    return ''
}

export function getTokenModel() {
    return TokenDeviceModel.getTokenModel()
}

export function insertStatusAdmin(params) {
    StatusAdminModel.insertStatusAdmin(params)
}

export function getStatusAdmin() {
    return StatusAdminModel.getStatusAdmin()
}

export function insertSetting(params) {
    SettingModel.insertSetting(params)
}

export function getIntroAppSetting(params) {
    return SettingModel.getIntroAppSetting(params)
}

export function installAccountLogin(params) {
    // console.log("PARAMS :", params);
    AccountModel.insertOrUpdate(params, true)
}

export function getAllAccountLogin() {
    return AccountModel.getAll()
}

export function deleteItemAccountLogin(params) {
    return AccountModel.deleteItemAccountLogin(params)
}