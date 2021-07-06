import {ActionsType} from '../../../commons/action/index'
const initialState = {
    dataChangeThongTin: {},
}

const ThongTinNguoiDungReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionsType.CHANGE_THONG_TIN_NGUOI_DUNG:
            return Object.assign({}, state, {
                dataChangeThongTin: action.data,
            });
        default:
            return state;
    }
};

export default ThongTinNguoiDungReducer