import mockTracks from './mock/tracks';
import { sideEffect } from 'redux-side-effects';

import {
    playerSetTrack,
    playerInit,
    playerSetPaused
} from '../side-effects/player';

// Actions
const INIT = 'kalama-player/tracks/INIT';
const SET_TRACKS = 'kalama-player/tracks/SET_TRACKS';
const SET_CURRENT_TRACK_INDEX = 'kalama-player/tracks/SET_CURRENT_TRACK_INDEX';
const TOGGLE_PAUSE = 'kalama-player/tracks/TOGGLE_PAUSE';
const ON_PLAYER_PLAYEND = 'kalama-player/tracks/ON_PLAYER_PLAYEND';
const ON_PLAYER_ERROR = 'kalama-player/tracks/ON_PLAYER_ERROR';
const ON_PLAYER_STATUS = 'kalama-player/tracks/ON_PLAYER_STATUS';
const ON_PLAYER_PLAYING = 'kalama-player/tracks/ON_PLAYER_PLAYING';
const ON_PLAYER_PAUSED = 'kalama-player/tracks/ON_PLAYER_PAUSED';

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
export const onPlayerPlayend = () => {
    return { type: ON_PLAYER_PLAYEND };
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
export const onPlayerStatus = status => {
    console.log({ status });
    return { type: ON_PLAYER_STATUS, payload: status };
};
export const togglePause = () => {
    return { type: TOGGLE_PAUSE };
};

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
            yield sideEffect(playerInit);
            return state;
        }

        case SET_TRACKS: {
            return { ...state, tracks: action.payload, current: null };
        }

        case TOGGLE_PAUSE: {
            yield sideEffect(
                playerSetPaused,
                { onPlayerPlaying, onPlayerPaused },
                !state.isPaused
            );

            return { ...state, isPaused: !state.isPaused };
        }

        // case ON_PLAYER_STATUS: {
        //     // yield sideEffect(playerSetPaused, !state.isPaused);

        //     return {
        //         ...state,
        //         playerStatus: { ...state.playerStatus, ...action.payload }
        //     };
        // }

        case SET_CURRENT_TRACK_INDEX: {
            const { payload: current } = action;
            const { tracks } = state;
            const track = tracks[current];
            yield sideEffect(
                playerSetTrack,
                { onPlayerPlaying, onPlayerPlayend },
                track
            );
            return { ...state, current: action.payload };
        }

        case ON_PLAYER_PLAYING: {
            console.log(ON_PLAYER_PLAYING);
            return { ...state, isPlaying: true, isPaused: false };
        }

        case ON_PLAYER_PLAYEND: {
            return { ...state, isPlaying: false, isPaused: false };
        }

        case ON_PLAYER_PAUSED: {
            return { ...state, isPlaying: false, isPaused: true };
        }

        default:
            return state;
    }
};
