import {ActionsType} from '../../../commons/action/index';
const initialState = {
  dataListActions: null,
  dataListChuaDuyet: null,
  dataListDaDuyet: null,
  dataListTuChoi: null,
  messageDeleteOrder: '',
  dataNumberOrder: {},
};

const HistoryXinPhepReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionsType.REQUESET_DATA_LIST_ACTIONS:
      return Object.assign({}, state, {
        dataListActions: action.data,
      });
    case ActionsType.REQUESET_DATA_LIST_CHUA_DUYET:
      return Object.assign({}, state, {
        dataListChuaDuyet: action.data,
      });
    case ActionsType.REQUESET_DATA_LIST_DA_DUYET:
      return Object.assign({}, state, {
        dataListDaDuyet: action.data,
      });
    case ActionsType.REQUESET_DATA_LIST_TU_CHOI:
      return Object.assign({}, state, {
        dataListTuChoi: action.data,
      });
    case ActionsType.REQUESET_DELETE_ITEM_ORDER:
      return Object.assign({}, state, {
        messageDeleteOrder: action.data,
      });
    case ActionsType.REQUESET_DATA_GET_NUMBER_ORDER:
      return Object.assign({}, state, {
        dataNumberOrder: action.data,
      });
    default:
      return state;
  }
};

export default HistoryXinPhepReducer;
