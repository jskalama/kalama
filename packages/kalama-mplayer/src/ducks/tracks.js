import mockTracks from './mock/tracks';
import { sideEffect } from 'redux-side-effects';

import {
    playerSetTrack,
    playerInit,
    playerSetPaused,
    playerShutdown
} from '../side-effects/player';

import { appKeyboardInit, appExit } from '../side-effects/app';

// Actions
const INIT = 'kalama-player/tracks/INIT';
const SHUTDOWN = 'kalama-player/tracks/SHUTDOWN';
const SET_TRACKS = 'kalama-player/tracks/SET_TRACKS';
const SET_CURRENT_TRACK_INDEX = 'kalama-player/tracks/SET_CURRENT_TRACK_INDEX';
const TOGGLE_PAUSE = 'kalama-player/tracks/TOGGLE_PAUSE';
const ON_PLAYER_END = 'kalama-player/tracks/ON_PLAYER_END';
const ON_PLAYER_ERROR = 'kalama-player/tracks/ON_PLAYER_ERROR';
const ON_PLAYER_PLAYING = 'kalama-player/tracks/ON_PLAYER_PLAYING';
const ON_PLAYER_PAUSED = 'kalama-player/tracks/ON_PLAYER_PAUSED';
const ON_PLAYER_PREMATURE_END = 'kalama-player/tracks/ON_PLAYER_PREMATURE_END';
const ON_PLAYER_SHUTDOWN = 'kalama-player/tracks/ON_PLAYER_SHUTDOWN';

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

//player actions

const playerActions = {
    onPlayerEnd,
    onPlayerPlaying,
    onPlayerPaused,
    onPlayerError,
    onPlayerPrematureEnd,
    onPlayerShutdown
};

const playerCommand = (command, ...args) =>
    sideEffect(command, playerActions, ...args);

//app actions
const appActions = {
    togglePause,
    shutdown
};

const appComand = (command, ...args) =>
    sideEffect(command, appActions, ...args);

// Reducer

const INITIAL_STATE = {
    tracks: mockTracks,
    current: null,
    isPlaying: false,
    isPaused: false
};

export const reducer = function*(state = INITIAL_STATE, action) {
    switch (action.type) {
        case INIT: {
            yield playerCommand(playerInit);
            yield appComand(appKeyboardInit);
            return state;
        }

        case SHUTDOWN: {
            yield playerCommand(playerShutdown);
            return state;
        }

        case SET_TRACKS: {
            return { ...state, tracks: action.payload, current: null };
        }

        case TOGGLE_PAUSE: {
            yield playerCommand(playerSetPaused, !state.isPaused);

            return { ...state, isPaused: !state.isPaused };
        }

        case SET_CURRENT_TRACK_INDEX: {
            const { payload: current } = action;
            const { tracks } = state;
            const track = tracks[current];
            yield playerCommand(playerSetTrack, track);
            return { ...state, current: action.payload };
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

        case ON_PLAYER_SHUTDOWN: {
            yield appComand(appExit);
            return state;
        }

        default:
            return state;
    }
};
