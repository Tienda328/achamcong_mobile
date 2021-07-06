import { ActionsType } from '../../../commons/action/index'
const initialState = {
    messageReponDiMuonVeSom: null,
    dataList: null,
    dataListDaDuyet: null,
    dataListTuChoi: null,
    messageDeleteChuaDuyet: null,
    messageDelete: null
}

const DuyetDiMuonVeSomReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionsType.REPON_DUYET_DI_MUON_VE_SOM:
            return Object.assign({}, state, {
                messageReponDiMuonVeSom: action.data,
            });
        case ActionsType.REQUESET_DATA_DUYET_DI_MUON_VE_SOM:
            return Object.assign({}, state, {
                dataList: action.data,
            });
        case ActionsType.REQUESET_DATA_DUYET_DI_MUON_VE_SOM_DA_DUYET:
            return Object.assign({}, state, {
                dataListDaDuyet: action.data,
            });
        case ActionsType.REQUESET_DATA_DUYET_DI_MUON_VE_SOM_TU_CHOI:
            return Object.assign({}, state, {
                dataListTuChoi: action.data,
            });
        case ActionsType.REQUESET_DELETE_DUYET_DI_MUON_VE_SOM_CHUA_DUYET:
            return Object.assign({}, state, {
                messageDeleteChuaDuyet: action.data,
            });
        case ActionsType.REQUESET_DELETE_DUYET_DI_MUON_VE_SOM:
            return Object.assign({}, state, {
                messageDelete: action.data,
            });
        default:
            return state;
    }
};

export default DuyetDiMuonVeSomReducer