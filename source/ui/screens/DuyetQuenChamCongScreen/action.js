import {ActionsType} from '../../../commons/action/index'

export function reponDuyetQuenChamCong(data) {
  return {
    type: ActionsType.REPON_DUYET_QUEN_CHAM_CONG,
    data: data,
  }
}

export function requestDataDuyetQuenChamCong(data) {
  return {
    type: ActionsType.REQUESET_DATA_DUYET_QUEN_CHAM_CONG,
    data: data,
  }
}

export function requestDataDuyetQuenChamCongDaDuyet(data) {
  return {
    type: ActionsType.REQUESET_DATA_DUYET_QUEN_CHAM_CONG_DA_DUYET,
    data: data,
  }
}

export function requestDataDuyetQuenChamCongTuChoi(data) {
  return {
    type: ActionsType.REQUESET_DATA_DUYET_QUEN_CHAM_CONG_TU_CHOI,
    data: data,
  }
}

export function requestDeleteDuyetQuenChamCong(data) {
  return {
    type: ActionsType.REQUESET_DELETE_DUYET_QUEN_CHAM_CONG,
    data: data,
  }
}

export function requestDeleteDuyetQuenChamCongChuaDuyet(data) {
  return {
    type: ActionsType.REQUESET_DELETE_DUYET_QUEN_CHAM_CONG_CHUA_DUYET,
    data: data,
  }
}