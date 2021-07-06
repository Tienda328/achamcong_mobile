import { ActionsType } from '../../../commons/action/index';

export function requestDataReason(data) {
  return {
    type: ActionsType.REQUESET_DATA_GET_REASON,
    data: data,
  };
}

export function getListBlock(data) {
  return {
    type: ActionsType.GET_LIST_BLOCK,
    data: data,
  };
}

export function getListBlookCa(data) {
  return {
    type: ActionsType.GET_LIST_BLOCK_CA,
    data: data,
  };
}

export function getListBlockWithUser(data) {
  return {
    type: ActionsType.GET_LIST_BLOCK_WITH_USER,
    data: data,
  };
}

export function createApplicationForChangeShift(data) {
  return {
    type: ActionsType.CREATE_APPLICATION_FOR_CHANGE_SHIFT,
    data: data,
  };
}

export function updateApplicationForChangeShiftByUser(data) {
  return {
    type: ActionsType.UPDATE_APLLICATION_CHANGE_SHIFT_BY_USER,
    data: data,
  };
}

export function deleteApplicationForChangeShiftByUser(data) {
  return {
    type: ActionsType.DELETE_APPLICATION_CHANGE_SHIFT_BY_USER,
    data: data,
  };
}

export function getListApplicationForChangeShift(data) {
  return {
    type: ActionsType.GET_LIST_APPLICATION_FOR_CHANGE_SHIFT,
    data: data,
  };
}

export function updateApplicationForChangeShiftByAdmin(data) {
  return {
    type: ActionsType.UPDATE_APLLICATION_CHANGE_SHIFT_BY_AMIN,
    data: data,
  };
}

export function deleteApplicationForChangeShiftByAdmin(data) {
  return {
    type: ActionsType.DELETE_APPLICATION_CHANGE_SHIFT_BY_ADMIN,
    data: data,
  };
}
