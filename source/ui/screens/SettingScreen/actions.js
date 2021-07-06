import {ActionsType} from '../../../commons/action/index'

export function requertDataAdminShift(data) {
  return {
    type: ActionsType.REQUESET_DATA_ADMIN_SHIFT,
    data: data,
  }
}

export function requertDataImageCamera(data) {
  return {
    type: ActionsType.REQUESET_DATA_IMAGE_CAMERA,
    data: data,
  }
}

export function requertIsCreateFaceId(data) {
  return {
    type: ActionsType.REQUESET_IS_CREATE_FACEID,
    data: data,
  }
}

export function requertIsUpdateStatus(data) {
  return {
    type: ActionsType.REQUESET_IS_UPDATE_STATUS,
    data: data,
  }
}