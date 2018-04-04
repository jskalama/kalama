import { createSelector } from 'reselect';
import FuzzySearch from 'fuzzy-search';
import orderAlbums from './search/orderAlbums';

// Actions
export const ON_QUERY_CHANGE = 'Search/ON_QUERY_CHANGE';
export const ON_ALBUM_QUERY_CHANGE = 'Search/ON_ALBUM_QUERY_CHANGE';
export const ON_QUERY_RESULT = 'Search/ON_QUERY_RESULT';
export const ON_ALBUMS_RESULT = 'Search/ON_ALBUMS_RESULT';
export const ON_SUGGECTION_SELECT = 'Search/ON_SUGGECTION_SELECT';
export const ON_ALBUM_SELECT = 'Search/ON_ALBUM_SELECT';
export const GO_TO_ALBUMS = 'Search/GO_TO_ALBUMS';
export const GO_TO_SEARCH = 'Search/GO_TO_SEARCH';
export const LOAD_TRACKS_LIST = 'Search/LOAD_TRACKS_LIST';

const defaultState = {
    step: 'search',
    suggestions: [],
    albums: [],
    selectedSuggestion: null,
    query: '',
    albumQuery: ''
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
        case ON_QUERY_CHANGE: {
            return { ...state, query: action.payload };
        }
        case ON_ALBUM_QUERY_CHANGE: {
            return { ...state, albumQuery: action.payload };
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

export const OnAlbumQueryChange = value => ({
    type: ON_ALBUM_QUERY_CHANGE,
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

export const OnAlbumSelect = album => ({
    type: ON_ALBUM_SELECT,
    payload: album
});

export const GoToAlbums = () => ({
    type: GO_TO_ALBUMS
});

export const GoToSearch = () => ({
    type: GO_TO_SEARCH
});

export const LoadTracksList = resource => ({
    type: LOAD_TRACKS_LIST,
    payload: resource
});

//Selectors
export const getQuery = state => state.search.query;
export const getQueryResult = state => state.search.suggestions;
export const getAlbums = state => state.search.albums;
export const getAlbumQuery = state => state.search.albumQuery;
export const isSearchStep = state => state.search.step === 'search';
export const isAlbumsStep = state => state.search.step === 'albums';
export const getFilteredAlbums = createSelector(
    getAlbums,
    getAlbumQuery,
    (albums, albumQuery) => {
        if (!albums.length) {
            return [];
        }
        const searcher = new FuzzySearch(albums, ['label'], {
            caseSensitive: false
        });
        return orderAlbums(searcher.search(albumQuery));
    }
);
