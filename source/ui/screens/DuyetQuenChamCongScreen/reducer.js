import { ActionsType } from '../../../commons/action/index'
const initialState = {
    messageReponQuenChamCong: null,
    dataList: null,
    dataListDaDuyet: null,
    dataListTuChoi: null,
    messageDeleteChuaDuyet: null,
    messageDelete: null
}

const DuyetQuenChamCongReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionsType.REPON_DUYET_QUEN_CHAM_CONG:
            return Object.assign({}, state, {
                messageReponQuenChamCong: action.data,
            });
        case ActionsType.REQUESET_DATA_DUYET_QUEN_CHAM_CONG:
            return Object.assign({}, state, {
                dataList: action.data,
            });
        case ActionsType.REQUESET_DATA_DUYET_QUEN_CHAM_CONG_DA_DUYET:
            return Object.assign({}, state, {
                dataListDaDuyet: action.data,
            });
        case ActionsType.REQUESET_DATA_DUYET_QUEN_CHAM_CONG_TU_CHOI:
            return Object.assign({}, state, {
                dataListTuChoi: action.data,
            });
        case ActionsType.REQUESET_DELETE_DUYET_QUEN_CHAM_CONG_CHUA_DUYET:
            return Object.assign({}, state, {
                messageDeleteChuaDuyet: action.data,
            });
        case ActionsType.REQUESET_DELETE_DUYET_QUEN_CHAM_CONG:
            return Object.assign({}, state, {
                messageDelete: action.data,
            });
        default:
            return state;
    }
};

export default DuyetQuenChamCongReducer