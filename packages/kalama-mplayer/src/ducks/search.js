// Actions
export const ON_QUERY_CHANGE = 'SEARCH/ON_QUERY_CHANGE';
export const ON_QUERY_RESULT = 'SEARCH/ON_QUERY_RESULT';

const defaultState = {
    suggestions: []
};

// Reducer
export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case ON_QUERY_RESULT: {
            return { suggestions: action.payload };
        }
        default:
            return state;
    }
}

// Action Creators
export const OnQueryChange = value => ({
    type: ON_QUERY_CHANGE,
    payload: value
});

export const OnQueryResult = suggestions => ({
    type: ON_QUERY_RESULT,
    payload: suggestions
});

//Selectors
export const getQueryResult = state => state.search.suggestions;
