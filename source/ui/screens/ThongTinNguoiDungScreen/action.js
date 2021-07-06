import {ActionsType} from '../../../commons/action/index'

export function requestChangeThongTinNguoiDung(data) {
  return {
    type: ActionsType.CHANGE_THONG_TIN_NGUOI_DUNG,
    data: data,
  }
}

export function requestDataLateSoon1(data) {
  return {
    type: ActionsType.REQUESET_CHANGE_PASSWORD,
    data: data,
  }
}