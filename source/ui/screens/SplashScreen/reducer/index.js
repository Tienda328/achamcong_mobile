import {ActionsType} from '../../../../commons/action/index'
const initialState = {
    countImage: null,
    isCheckVersion: null,
    messageCheckVersion: null,
}

const SplashReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionsType.REQUESET_GET_COUNT_IMAGE:
            // console.log("action.data:   " + JSON.stringify(action.data))
            return Object.assign({}, state, {
                countImage: action.data.countImage,
                messageCheckVersion: action.data.messageCheckVersion,
                isCheckVersion: action.data.isCheckVersion,
            });
        default:
            return state;
    }
};

export default SplashReducer