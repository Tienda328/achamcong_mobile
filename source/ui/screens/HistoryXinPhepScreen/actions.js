import {ActionsType} from '../../../commons/action/index';

export function requestDataListAction(data) {
  return {
    type: ActionsType.REQUESET_DATA_LIST_ACTIONS,
    data: data,
  };
}

export function requestDataListChuaDuyet(data) {
  return {
    type: ActionsType.REQUESET_DATA_LIST_CHUA_DUYET,
    data: data,
  };
}

export function requestDataListDaDuyet(data) {
  return {
    type: ActionsType.REQUESET_DATA_LIST_DA_DUYET,
    data: data,
  };
}

export function requestDataListTuChoi(data) {
  return {
    type: ActionsType.REQUESET_DATA_LIST_TU_CHOI,
    data: data,
  };
}

export function requestDeleteItemOrder(data) {
  return {
    type: ActionsType.REQUESET_DELETE_ITEM_ORDER,
    data: data,
  };
}

export function requestDataNumberOrder(data) {
  return {
    type: ActionsType.REQUESET_DATA_GET_NUMBER_ORDER,
    data: data,
  };
}
