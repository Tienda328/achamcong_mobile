import { ActionsType } from '../../../commons/action/index'
const initialState = {
    baoCaoTongQuan: {}
}

const BaoCaoReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionsType.GET_BAO_CAO_TONG_QUAN:
            return {
                ...state,
                baoCaoTongQuan: action.data,
            };
        default:
            return state;
    }
};

export default BaoCaoReducer