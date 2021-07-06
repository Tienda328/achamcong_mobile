import {ActionsType} from '../../../commons/action/index'
const initialState = {
    dataDetailTimeSheet: null,
}

const DuyetDetailAllReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionsType.REQUESET_DETAIL_TIME_SHEET_ALL:
            return Object.assign({}, state, {
                dataDetailTimeSheet: action.data,
            });
        default:
            return state;
    }
};

export default DuyetDetailAllReducer