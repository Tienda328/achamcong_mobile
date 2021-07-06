import { ActionsType } from '../../../commons/action/index'
const initialState = {
    detaiTimeSheet: {},
    listBlockCa: []
}

const LocBaoCaoReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionsType.GET_DETAIL_TIME_SHEET:
            return {
                ...state,
                detaiTimeSheet: action.data,
            };
        case ActionsType.GET_LIST_BLOCK_CA:
            return {
                ...state,
                listBlockCa: action.data,
            };
        default:
            return state;
    }
};

export default LocBaoCaoReducer