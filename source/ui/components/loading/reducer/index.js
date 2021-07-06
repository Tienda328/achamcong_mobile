const initialState = { showLoading: false};

function ui(state = initialState, action) {
    switch (action.type) {
        case 'SHOW_LOADING':
            if (state.message) {
                return state;
            }
            return { ...state, showLoading: true };
        case 'HIDE_LOADING':
            return { ...state, showLoading: false };
        default:
            return state;
    }
}

export default ui;