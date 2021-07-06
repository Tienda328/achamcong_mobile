import {ActionsType} from '../../../commons/action/index'
const initialState = {
    dataCreateFolderImage: null,
}

const ChenImageReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionsType.REQUESET_IS_CREATE_FOLDER_IMAGE:
            return Object.assign({}, state, {
                dataCreateFolderImage: action.data,
            });
        default:
            return state;
    }
};

export default ChenImageReducer