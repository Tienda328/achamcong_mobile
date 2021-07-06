import {ActionsType} from '../../../commons/action/index';
const initialState = {
  dataHistory: null,
  dataTimeSetUp: {},
  dataCheckBusiness: {},
  detailBlockInDate: {},
};

const CheckInHomeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionsType.REQUESET_DATA_HISTORY_NGAY_CONG:
      return Object.assign({}, state, {
        dataHistory: action.data.responsesData,
        dataTimeSetUp: action.data.dataTimeSetUp,
        resultDataFree: action.data.resultDataFree,
        detailBlockInDate: action.data.detailBlockInDate,
        detailDataMonth: action.data.detailDataMonth,
      });
    case ActionsType.REQUESET_DATA_CHECK_BUSINESS:
      return Object.assign({}, state, {
        dataCheckBusiness: action.data,
      });
    case ActionsType.UPDATE_LOCATION:
      return state;
    default:
      return state;
  }
};

export default CheckInHomeReducer;
