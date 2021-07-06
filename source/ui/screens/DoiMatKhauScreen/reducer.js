import {ActionsType} from '../../../commons/action/index'
const initialState = {
    messageChangePass: null,
}

const DoiMatKhauReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionsType.REQUESET_CHANGE_PASSWORD:
            return Object.assign({}, state, {
                messageChangePass: action.data,
            });
        default:
            return state;
    }
};

export default DoiMatKhauReducer