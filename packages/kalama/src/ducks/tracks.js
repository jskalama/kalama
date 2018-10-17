import { createSelector } from 'reselect';
import prefixizeTrackNames from './tracks/prefixizeTrackNames';

// Actions
export const INIT = 'kalama-player/tracks/INIT';
export const SHUTDOWN = 'kalama-player/tracks/SHUTDOWN';
export const SET_TRACKS = 'kalama-player/tracks/SET_TRACKS';
export const SET_CURRENT_TRACK_INDEX =
    'kalama-player/tracks/SET_CURRENT_TRACK_INDEX';
export const TOGGLE_PAUSE = 'kalama-player/tracks/TOGGLE_PAUSE';
export const STEP_BACK = 'kalama-player/tracks/STEP_BACK';
export const STEP_FORWARD = 'kalama-player/tracks/STEP_FORWARD';
export const GO_TO_NEXT_TRACK = 'kalama-player/tracks/GO_TO_NEXT_TRACK';
export const GO_TO_PREV_TRACK = 'kalama-player/tracks/GO_TO_PREV_TRACK';
export const VOLUME_DOWN = 'kalama-player/tracks/VOLUME_DOWN';
export const VOLUME_UP = 'kalama-player/tracks/VOLUME_UP';

export const ON_PLAYER_END = 'kalama-player/tracks/ON_PLAYER_END';
export const ON_PLAYER_ERROR = 'kalama-player/tracks/ON_PLAYER_ERROR';
export const ON_PLAYER_PLAYING = 'kalama-player/tracks/ON_PLAYER_PLAYING';
export const ON_PLAYER_PAUSED = 'kalama-player/tracks/ON_PLAYER_PAUSED';
export const ON_PLAYER_PREMATURE_END =
    'kalama-player/tracks/ON_PLAYER_PREMATURE_END';
export const ON_PLAYER_SHUTDOWN = 'kalama-player/tracks/ON_PLAYER_SHUTDOWN';
export const ON_PLAYER_CURRENT_TIME_CHANGED =
    'kalama-player/tracks/ON_PLAYER_CURRENT_TIME_CHANGED';

export const ON_POLLER_TICK = 'kalama-player/tracks/ON_POLLER_TICK';
export const SET_PLAYER_INTERACTIVE =
    'kalama-player/tracks/SET_PLAYER_INTERACTIVE';
export const DIRECT_TRACK_SELECT = 'kalama-player/tracks/DIRECT_TRACK_SELECT';
export const ON_CACHE_STATE_CHANGE =
    'kalama-player/tracks/ON_CACHE_STATE_CHANGE';
export const ON_CACHE_READY = 'kalama-player/tracks/ON_CACHE_READY';

// Action creators

export const init = () => {
    return { type: INIT };
};
export const setTracks = (tracks, parentResource) => {
    return { type: SET_TRACKS, payload: tracks, meta: { parentResource } };
};
export const onCacheStateChange = cacheItems => {
    return { type: ON_CACHE_STATE_CHANGE, payload: cacheItems };
};
export const onCacheReady = () => {
    return { type: ON_CACHE_READY };
};
export const setCurrentTrackIndex = idx => {
    return { type: SET_CURRENT_TRACK_INDEX, payload: idx };
};
export const directTrackSelect = idx => {
    return { type: DIRECT_TRACK_SELECT, payload: idx };
};
export const togglePause = () => {
    return { type: TOGGLE_PAUSE };
};
export const stepBack = () => {
    return { type: STEP_BACK };
};
export const stepForward = () => {
    return { type: STEP_FORWARD };
};
export const goToNextTrack = () => {
    return { type: GO_TO_NEXT_TRACK };
};
export const goToPrevTrack = () => {
    return { type: GO_TO_PREV_TRACK };
};
export const volumeUp = () => {
    return { type: VOLUME_UP };
};
export const volumeDown = () => {
    return { type: VOLUME_DOWN };
};
export const shutdown = () => {
    return { type: SHUTDOWN };
};
export const onPlayerEnd = () => {
    return { type: ON_PLAYER_END };
};
export const onPlayerPlaying = () => {
    return { type: ON_PLAYER_PLAYING };
};
export const onPlayerPaused = () => {
    return { type: ON_PLAYER_PAUSED };
};
export const onPlayerError = () => {
    return { type: ON_PLAYER_ERROR };
};
export const onPlayerPrematureEnd = () => {
    return { type: ON_PLAYER_PREMATURE_END };
};
export const onPlayerShutdown = () => {
    return { type: ON_PLAYER_SHUTDOWN };
};
export const onPollerTick = () => {
    return { type: ON_POLLER_TICK };
};
export const onPlayerCurrentTimeChanged = time => {
    return { type: ON_PLAYER_CURRENT_TIME_CHANGED, payload: time };
};
export const setPlayerInteractive = isInteractive => {
    return { type: SET_PLAYER_INTERACTIVE, payload: !!isInteractive };
};

// Reducer

const INITIAL_STATE = {
    tracks: [],
    cache: {},
    parentResource: null,
    current: null,
    isPlaying: false,
    isPaused: false,
    currentTime: null,
    isInteractive: false
};

const getTrackIndex = (state, trackNumber) => {
    const { tracks } = state;
    const { current: oldCurrent } = state;

    const newCurrent =
        trackNumber === 'next'
            ? ((oldCurrent | 0) + 1 + tracks.length) % tracks.length
            : trackNumber === 'prev'
                ? ((oldCurrent | 0) - 1 + tracks.length) % tracks.length
                : trackNumber;

    return newCurrent;
};

export default function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case SET_TRACKS: {
            return {
                ...state,
                tracks: action.payload,
                parentResource: action.meta.parentResource,
                current: null
            };
        }

        case ON_CACHE_STATE_CHANGE: {
            return {
                ...state,
                cache: {
                    ...state.cache,
                    ...action.payload
                }
            };
        }

        case TOGGLE_PAUSE: {
            return { ...state, isPaused: !state.isPaused };
        }

        case SET_CURRENT_TRACK_INDEX: {
            const current = action.payload;
            return { ...state, current: current };
        }

        case GO_TO_NEXT_TRACK: {
            const current = getTrackIndex(state, 'next');
            return { ...state, current };
        }

        case GO_TO_PREV_TRACK: {
            const current = getTrackIndex(state, 'prev');
            return { ...state, current };
        }

        case ON_PLAYER_PLAYING: {
            return { ...state, isPlaying: true, isPaused: false };
        }

        case ON_PLAYER_END: {
            return { ...state, isPlaying: false, isPaused: false };
        }

        case ON_PLAYER_PREMATURE_END: {
            return { ...state, isPlaying: false, isPaused: false };
        }

        case ON_PLAYER_PAUSED: {
            return { ...state, isPlaying: false, isPaused: true };
        }

        case ON_PLAYER_CURRENT_TIME_CHANGED: {
            return { ...state, currentTime: action.payload };
        }

        case SET_PLAYER_INTERACTIVE: {
            return { ...state, isInteractive: !!action.payload };
        }

        default:
            return state;
    }
}

// Selectors
export const isPlayerInteractive = state => state.tracks.isInteractive;
export const isPlayerPaused = state => state.tracks.isPaused;
export const getCache = state => state.tracks.cache;
export const getRawTracks = state => state.tracks.tracks;
export const hasTracks = state => getTracks(state).length > 0;
export const getCurrentTrackIndex = state => state.tracks.current;
export const getCurrentTrack = state =>
    getPrefixizedTracks(state)[getCurrentTrackIndex(state)];
export const getParentResource = ({ tracks: { parentResource } }) =>
    parentResource;
export const getParentResourceLabel = ({ tracks: { parentResource } }) =>
    parentResource ? parentResource.label || 'Unknown' : 'Unknown';

// Memoized Selectors
export const getTracks = createSelector(
    getRawTracks,
    getCache,
    (tracks, cache) =>
        tracks.map(track => ({
            ...track,
            cacheFile: cache[track.id] ? cache[track.id].file : null
        }))
);
export const getPrefixizedTracks = createSelector(getTracks, tracks =>
    prefixizeTrackNames(tracks)
);

export const getPrefixizedRawTracks = createSelector(getRawTracks, tracks =>
    prefixizeTrackNames(tracks)
);

export const isFirstTrackCached = createSelector(
    getTracks,
    tracks => !!tracks[0].cacheFile
);

export const areAllTracksCached = createSelector(getTracks, tracks =>
    tracks.every(track => !!track.cacheFile)
);

export const getCacheProgress = createSelector(getTracks, tracks => {
    return tracks.reduce(
        (stat, { cacheFile }) => {
            if (cacheFile) {
                stat.cached++;
            }
            return stat;
        },
        { cached: 0, total: tracks.length }
    );
});
