import {ActionsType} from '../../../commons/action/index';

export function requestDataHistory(data) {
  return {
    type: ActionsType.REQUESET_DATA_HISTORY_NGAY_CONG,
    data: data,
  };
}

export function requestDataCheckBusiness(data) {
  return {
    type: ActionsType.REQUESET_DATA_CHECK_BUSINESS,
    data: data,
  };
}

export function updateLocation(data) {
  return {
    type: ActionsType.UPDATE_LOCATION,
    data: data,
  };
}
