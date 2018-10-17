// Actions
export const SHOW_MESSAGE = 'FlashMessages/SHOW_MESSAGE';
export const HIDE_MESSAGE = 'FlashMessages/HIDE_MESSAGE';

const defaultState = {
    message: null
};

// Reducer
export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case SHOW_MESSAGE:
            return {
                ...state,
                message: action.payload
            };
        case HIDE_MESSAGE:
            return {
                ...state,
                message: null
            };
        default:
            return state;
    }
}

// Action Creators
export const showMessage = msg => ({
    type: SHOW_MESSAGE,
    payload: msg
});

export const hideMessage = () => ({
    type: HIDE_MESSAGE
});

// Selectors
export const getMessage = state => state.flashMessages.message;
