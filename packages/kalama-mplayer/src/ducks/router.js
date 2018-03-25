// Actions
const NAVIGATE = 'Router/NAVIGATE';

const defaultState = {
    route: { screen: null, params: {} }
};

// Reducer
export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case NAVIGATE:
            return {
                ...state,
                route: {
                    screen: action.payload.screen
                }
            };
        default:
            return state;
    }
}

// Action Creators
export const Navigate = screen => ({ type: NAVIGATE, payload: { screen } });

//Selectors
export const getRoute = state => state.router.route;
