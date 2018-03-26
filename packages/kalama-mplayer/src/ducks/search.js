// Actions
export const ON_QUERY_CHANGE = 'Search/ON_QUERY_CHANGE';
export const ON_QUERY_RESULT = 'Search/ON_QUERY_RESULT';
export const ON_ALBUMS_RESULT = 'Search/ON_ALBUMS_RESULT';
export const ON_SUGGECTION_SELECT = 'Search/ON_SUGGECTION_SELECT';
export const GO_TO_ALBUMS = 'Search/GO_TO_ALBUMS';
export const GO_TO_SEARCH = 'Search/GO_TO_SEARCH';

const defaultState = {
    step: 'search',
    suggestions: [],
    albums: [],
    selectedSuggestion: null
};

// Reducer
export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case GO_TO_SEARCH: {
            return { ...state, step: 'search' };
        }
        case GO_TO_ALBUMS: {
            return { ...state, step: 'albums' };
        }
        case ON_QUERY_RESULT: {
            return { ...state, suggestions: action.payload };
        }
        case ON_ALBUMS_RESULT: {
            return { ...state, albums: action.payload };
        }
        case ON_SUGGECTION_SELECT: {
            return { ...state, selectedSuggestion: action.payload };
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

export const OnAlbumsResult = albums => ({
    type: ON_ALBUMS_RESULT,
    payload: albums
});

export const OnSuggestionSelect = suggestion => ({
    type: ON_SUGGECTION_SELECT,
    payload: suggestion
});

export const GoToAlbums = () => ({
    type: GO_TO_ALBUMS
});

export const GoToSearch = () => ({
    type: GO_TO_SEARCH
});

//Selectors
export const getQueryResult = state => state.search.suggestions;
export const getAlbums = state => state.search.albums;
export const isSearchStep = state => state.search.step === 'search';
export const isAlbumsStep = state => state.search.step === 'albums';
