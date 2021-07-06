import { ActionsType } from '../../../commons/action/index'
const initialState = {
    dataList: null,
    dataListDaDuyet: null,
    dataListTuChoi: null,
    messageDeleteChuaDuyet: null,
    messageDelete: null,
    dataMessageDuyetNghiPhep: null
}

const DuyetNghiPhepReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionsType.REQUESET_MESSAGE_DUYET_NGHI_PHEP:
            console.log('reducer di muon ve som get list', action);
            return Object.assign({}, state, {
                dataMessageDuyetNghiPhep: action.data,
            });
        case ActionsType.REQUESET_DATA_DUYET_NGHI_PHEP:
            console.log('reducer nghi phep get list', action);
            return Object.assign({}, state, {
                dataList: action.data,
            });
        case ActionsType.REQUESET_DATA_DUYET_NGHI_PHEP_DA_DUYET:
            console.log('reducer nghi phep get list', action);
            return Object.assign({}, state, {
                dataListDaDuyet: action.data,
            });
        case ActionsType.REQUESET_DATA_DUYET_NGHI_PHEP_TU_CHOI:
            console.log('reducer nghi phep get list', action);
            return Object.assign({}, state, {
                dataListTuChoi: action.data,
            });
        case ActionsType.REQUESET_DELETE_DUYET_NGHI_PHEP_CHUA_DUYET:
            console.log('reducer nghi phep get list', action);
            return Object.assign({}, state, {
                messageDeleteChuaDuyet: action.data,
            });
        case ActionsType.REQUESET_DELETE_DUYET_NGHI_PHEP:
            console.log('reducer nghi phep get list', action);
            return Object.assign({}, state, {
                messageDelete: action.data,
            });
        default:
            return state;
    }
};

export default DuyetNghiPhepReducer