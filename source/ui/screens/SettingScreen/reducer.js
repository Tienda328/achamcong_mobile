import { ActionsType } from '../../../commons/action/index'
const initialState = {
    dataAdminShift: [],
    //0: api false, 1: xac thuc faceid thanhf coong, 2 that bai
    isCreateFaceId: null,
    isUpdateStatus: null,
    // data 
}

const SettingReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionsType.REQUESET_DATA_ADMIN_SHIFT:
            return Object.assign({}, state, {
                dataAdminShift: action.data,
            });
        // case ActionsType.REQUESET_DATA_IMAGE_CAMERA:
        //     return Object.assign({}, state, {
        //         dataAdminShift: action.data,
        //     });
        case ActionsType.REQUESET_IS_CREATE_FACEID:
            return Object.assign({}, state, {
                isCreateFaceId: action.data,
            });
        case ActionsType.REQUESET_IS_UPDATE_STATUS:
            return Object.assign({}, state, {
                isUpdateStatus: action.data,
            });
        default:
            return state;
    }
};

export default SettingReducer