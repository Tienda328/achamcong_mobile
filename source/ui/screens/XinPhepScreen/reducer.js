import { actions, ActionsType } from '../../../commons/action/index';
const initialState = {
  dataReason: null,
  listBlock: [],
  listBlockWithUser: [],
  currentPage: 1,
  listBlockCa: []
};

const OrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionsType.REQUESET_DATA_GET_REASON:
      return Object.assign({}, state, {
        dataReason: action.data,
      });
    case ActionsType.GET_LIST_BLOCK:
      return {
        ...state,
        listBlock: action.data,
      };
    case ActionsType.GET_LIST_BLOCK_CA:
      return {
        ...state,
        listBlockCa: action.data,
      };

    case ActionsType.GET_LIST_BLOCK_WITH_USER:
      return {
        ...state,
        listBlockWithUser: action.data,
      };
    case ActionsType.CREATE_APPLICATION_FOR_CHANGE_SHIFT:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default OrderReducer;
