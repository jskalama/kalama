import mockTracks from './mock/tracks';
import { sideEffect } from 'redux-side-effects';

import {
    playerSetTrack,
    playerInit,
    playerSetPaused,
    playerShutdown,
    playerGetTime,
    playerStepBack,
    playerStepForward
} from '../side-effects/player';

import { appKeyboardInit, appExit } from '../side-effects/app';
import { pollerStart, pollerEnd } from '../side-effects/poller';

// Actions
const INIT = 'kalama-player/tracks/INIT';
const SHUTDOWN = 'kalama-player/tracks/SHUTDOWN';
const SET_TRACKS = 'kalama-player/tracks/SET_TRACKS';
const SET_CURRENT_TRACK_INDEX = 'kalama-player/tracks/SET_CURRENT_TRACK_INDEX';
const TOGGLE_PAUSE = 'kalama-player/tracks/TOGGLE_PAUSE';
const STEP_BACK = 'kalama-player/tracks/STEP_BACK';
const STEP_FORWARD = 'kalama-player/tracks/STEP_FORWARD';
const GO_TO_NEXT_TRACK = 'kalama-player/tracks/GO_TO_NEXT_TRACK';
const GO_TO_PREV_TRACK = 'kalama-player/tracks/GO_TO_PREV_TRACK';

const ON_PLAYER_END = 'kalama-player/tracks/ON_PLAYER_END';
const ON_PLAYER_ERROR = 'kalama-player/tracks/ON_PLAYER_ERROR';
const ON_PLAYER_PLAYING = 'kalama-player/tracks/ON_PLAYER_PLAYING';
const ON_PLAYER_PAUSED = 'kalama-player/tracks/ON_PLAYER_PAUSED';
const ON_PLAYER_PREMATURE_END = 'kalama-player/tracks/ON_PLAYER_PREMATURE_END';
const ON_PLAYER_SHUTDOWN = 'kalama-player/tracks/ON_PLAYER_SHUTDOWN';
const ON_PLAYER_CURRENT_TIME_CHANGED =
    'kalama-player/tracks/ON_PLAYER_CURRENT_TIME_CHANGED';

const ON_POLLER_TICK = 'kalama-player/tracks/ON_POLLER_TICK';

// Action creators

export const init = () => {
    return { type: INIT };
};
export const setTracks = tracks => {
    return { type: SET_TRACKS, payload: tracks };
};
export const setCurrentTrackIndex = idx => {
    return { type: SET_CURRENT_TRACK_INDEX, payload: idx };
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

// Reducer

const INITIAL_STATE = {
    tracks: mockTracks,
    current: null,
    isPlaying: false,
    isPaused: false,
    currentTime: null
};

export const reducer = function*(state = INITIAL_STATE, action) {
    switch (action.type) {
        case INIT: {
            yield sideEffect(playerInit);
            yield sideEffect(appKeyboardInit);
            return state;
        }

        case SHUTDOWN: {
            yield sideEffect(playerShutdown);
            return state;
        }

        case SET_TRACKS: {
            return { ...state, tracks: action.payload, current: null };
        }

        case TOGGLE_PAUSE: {
            yield sideEffect(playerSetPaused, !state.isPaused);

            return { ...state, isPaused: !state.isPaused };
        }

        case STEP_BACK: {
            yield sideEffect(playerStepBack);
            return state;
        }

        case STEP_FORWARD: {
            yield sideEffect(playerStepForward);
            return state;
        }

        case SET_CURRENT_TRACK_INDEX: {
            const { payload: current } = action;
            const { tracks } = state;
            const track = tracks[current];
            yield sideEffect(playerSetTrack, track);
            return { ...state, current: action.payload };
        }

        case GO_TO_NEXT_TRACK: {
            const { tracks } = state;
            const { current: oldCurrent } = state;
            const newCurrent =
                ((oldCurrent | 0) + 1 + tracks.length) % tracks.length;

            const track = tracks[newCurrent];
            yield sideEffect(playerSetTrack, track);
            return { ...state, current: newCurrent };
        }

        case GO_TO_PREV_TRACK: {
            const { tracks } = state;
            const { current: oldCurrent } = state;
            const newCurrent =
                ((oldCurrent | 0) - 1 + tracks.length) % tracks.length;
            const track = tracks[newCurrent];
            yield sideEffect(playerSetTrack, track);
            return { ...state, current: newCurrent };
        }

        case ON_PLAYER_PLAYING: {
            yield sideEffect(pollerStart);
            return { ...state, isPlaying: true, isPaused: false };
        }

        case ON_PLAYER_END: {
            yield sideEffect(pollerEnd);
            return { ...state, isPlaying: false, isPaused: false };
        }

        case ON_PLAYER_PREMATURE_END: {
            return { ...state, isPlaying: false, isPaused: false };
        }

        case ON_PLAYER_PAUSED: {
            return { ...state, isPlaying: false, isPaused: true };
        }

        case ON_PLAYER_SHUTDOWN: {
            yield sideEffect(appExit);
            return state;
        }

        case ON_POLLER_TICK: {
            yield sideEffect(playerGetTime);
            return state;
        }
        case ON_PLAYER_CURRENT_TIME_CHANGED: {
            return { ...state, currentTime: action.payload };
        }

        default:
            return state;
    }
};
