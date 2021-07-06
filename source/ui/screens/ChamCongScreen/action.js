import {ActionsType} from '../../../commons/action/index'

export function requestDataChamCong(data) {
  return {
    type: ActionsType.REQUESET_DATA_CHAM_CONG,
    data: data,
  }
}

export function resetAlert(data) {
  return {
    type: ActionsType.REQUESET_DATA_CHAM_CONG,
    data: "",
  }
}

export function requestDataChamCongFaceId(data) {
  return {
    type: ActionsType.REQUESET_DATA_CHAM_CONG_FACE_ID,
    data: data,
  }
}