import {ActionsType} from '../../../commons/action/index'

export function requestDataLateSoon(data) {
  return {
    type: ActionsType.REQUESET_LATE_SOON_ADMIN,
    data: data,
  }
}

export function requestDataTimekeepingDay(data) {
  return {
    type: ActionsType.REQUESET_DATA_TIMEKEEPING_DAY,
    data: data,
  }
}

export function requestDataListMap(data) {
  return {
    type: ActionsType.REQUESET_DATA_LIST_MAP,
    data: data,
  }
}