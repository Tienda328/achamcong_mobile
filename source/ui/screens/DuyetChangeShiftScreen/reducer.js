import { ActionsType } from '../../../commons/action/index'
const initialState = {
    messageReponChangeShift: null,
    dataList: null,
    dataListDaDuyet: null,
    dataListTuChoi: null,
    messageDeleteChuaDuyet: '',
    messageDelete: null
}

const DuyetChangeShiftReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionsType.RESPONSE_DUYET_CHANGE_SHIFT:
            return Object.assign({}, state, {
                messageReponChangeShift: action.data,
            });
        case ActionsType.REQUESET_DATA_DUYET_CHANGE_SHIFT:
            return Object.assign({}, state, {
                dataList: action.data,
            });
        case ActionsType.REQUESET_DATA_DUYET_CHANGE_SHIFT_DA_DUYET:
            return Object.assign({}, state, {
                dataListDaDuyet: action.data,
            });
        case ActionsType.REQUESET_DATA_DUYET_CHANGE_SHIFT_TU_CHOI:
            return Object.assign({}, state, {
                dataListTuChoi: action.data,
            });
        case ActionsType.REQUESET_DELETE_DUYET_CHANGE_SHIFT_CHUA_DUYET:
            return Object.assign({}, state, {
                messageDeleteChuaDuyet: action.data,
            });
        case ActionsType.REQUESET_DELETE_DUYET_CHANGE_SHIFT:
            return Object.assign({}, state, {
                messageDelete: action.data,
            });
        default:
            return state;
    }
};

export default DuyetChangeShiftReducer