import {ActionsType} from '../../../../commons/action/index'
const initialState = {
    isLogin: null,
    countImage: null,
    permission: "0",
    dataCreateTrial: {}
}

const LoginReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionsType.REQUESET_IS_LOGIN:
            return Object.assign({}, state, {
                isLogin: action.data.isLogin,
                countImage: action.data.countImage,
                permission: action.data.permission,
            });
        case ActionsType.REQUESET_CREATE_TRIAL:
            return Object.assign({}, state, {
                dataCreateTrial: action.data,
            });
        default:
            return state;
    }
};

export default LoginReducer