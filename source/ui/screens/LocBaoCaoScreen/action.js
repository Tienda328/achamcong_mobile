import { ActionsType } from '../../../commons/action/index'

export function getDetailTime_sheet(data) {
  return {
    type: ActionsType.GET_DETAIL_TIME_SHEET,
    data: data,
  };
}

export function getListBlookCa(data) {
  return {
    type: ActionsType.GET_LIST_BLOCK_CA,
    data: data,
  };
}

