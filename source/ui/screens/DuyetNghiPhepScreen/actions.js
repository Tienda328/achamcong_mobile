import {ActionsType} from '../../../commons/action/index'

export function requestMessageDuyetNghiPhep(data) {
  return {
    type: ActionsType.REQUESET_MESSAGE_DUYET_NGHI_PHEP,
    data: data,
  }
}

export function requestDataDuyetNghiPhep(data) {
  return {
    type: ActionsType.REQUESET_DATA_DUYET_NGHI_PHEP,
    data: data,
  }
}

export function requestDataDuyetNghiPhepDaDuyet(data) {
  return {
    type: ActionsType.REQUESET_DATA_DUYET_NGHI_PHEP_DA_DUYET,
    data: data,
  }
}

export function requestDataDuyetNghiPhepTuChoi(data) {
  return {
    type: ActionsType.REQUESET_DATA_DUYET_NGHI_PHEP_TU_CHOI,
    data: data,
  }
}

export function requestDeleteDuyetNghiPhep(data) {
  return {
    type: ActionsType.REQUESET_DELETE_DUYET_NGHI_PHEP,
    data: data,
  }
}

export function requestDeleteDuyetNghiPhepChuaDuyet(data) {
  return {
    type: ActionsType.REQUESET_DELETE_DUYET_NGHI_PHEP_CHUA_DUYET,
    data: data,
  }
}