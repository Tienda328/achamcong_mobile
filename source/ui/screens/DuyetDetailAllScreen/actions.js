import {ActionsType} from '../../../commons/action/index'

export function requestDetailAllTimeSheet(data) {
  return {
    type: ActionsType.REQUESET_DETAIL_TIME_SHEET_ALL,
    data: data,
  }
}