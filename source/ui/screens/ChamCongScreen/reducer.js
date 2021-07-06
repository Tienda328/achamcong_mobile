import { ActionsType } from '../../../commons/action/index'
const initialState = {
    isChamCong: '',
    isChamCongFaceId: '',
    dataTimeSetUp: {}
}

const ChamCongReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionsType.REQUESET_DATA_CHAM_CONG:
            return Object.assign({}, state, {
                isChamCong: action.data,
                // ...action.data
            });
        case ActionsType.REQUESET_DATA_CHAM_CONG_FACE_ID:
            return Object.assign({}, state, {
                isChamCongFaceId: action.data,
            });
        default:
            return state;
    }
};

export default ChamCongReducer