import {ActionsType} from '../../../commons/action/index'
const initialState = {
    dataLateSoon: null,
    dataTimekeepingDay: null,
    dataListMap: null
}

const ChartStatisticalReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionsType.REQUESET_LATE_SOON_ADMIN:
            return Object.assign({}, state, {
                dataLateSoon: action.data,
            });
        case ActionsType.REQUESET_DATA_TIMEKEEPING_DAY:
            return Object.assign({}, state, {
                dataTimekeepingDay: action.data,
            });
        case ActionsType.REQUESET_DATA_LIST_MAP:
            return Object.assign({}, state, {
                dataListMap: action.data                
            })
        default:
            return state;
    }
};

export default ChartStatisticalReducer