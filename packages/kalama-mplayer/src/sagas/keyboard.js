import { takeEvery } from 'redux-saga';
import {
    KEY_QUIT,
    KEY_PLAY_PAUSE,
    KEY_PREV_TRACK,
    KEY_NEXT_TRACK,
    KEY_REWIND,
    KEY_FAST_FORWARD,
    KEY_SEARCH,
    KEY_HELP,
    KEY_TABULATE
} from '../ducks/keyboard';
import {
    togglePause,
    shutdown,
    goToPrevTrack,
    goToNextTrack,
    stepBack,
    stepForward,
    isPlayerInteractive,
    hasTracks
} from '../ducks/tracks';
import { put, select } from 'redux-saga/effects';
import { getRoute, Navigate } from '../ducks/router';
import { GoToSearch, isAlbumsStep } from '../ducks/search';

function* quit() {
    yield put(shutdown());
}

function* playerKeys({ type }) {
    const isInteractive = yield select(isPlayerInteractive);

    if (!isInteractive) {
        return;
    }

    switch (type) {
        case KEY_PLAY_PAUSE: {
            yield put(togglePause());
            return;
        }
        case KEY_PREV_TRACK: {
            yield put(goToPrevTrack());
            return;
        }
        case KEY_NEXT_TRACK: {
            yield put(goToNextTrack());
            return;
        }
        case KEY_REWIND: {
            yield put(stepBack());
            return;
        }
        case KEY_FAST_FORWARD: {
            yield put(stepForward());
            return;
        }
    }
}

function* handleKey(action) {
    const route = yield select(getRoute);
    const isAlbums = yield select(isAlbumsStep);
    const playerHasTracks = yield select(hasTracks);
    switch (action.type) {
        case KEY_TABULATE: {
            if (route.screen === 'Search') {
                if (isAlbums) {
                    yield put(Navigate('Search'));
                    yield put(GoToSearch());
                    return;
                }
                if (playerHasTracks) {
                    yield put(Navigate('Player'));
                    return;
                }
            }
            if (route.screen === 'Player') {
                yield put(Navigate('Search'));
                yield put(GoToSearch());
                return;
            }
            if (route.screen === 'Help') {
                if (playerHasTracks) {
                    yield put(Navigate('Player'));
                    return;
                } else {
                    yield put(Navigate('Search'));
                    yield put(GoToSearch());
                    return;
                }
            }
            return;
        }
        case KEY_HELP: {
            yield put(Navigate('Help'));
            return;
        }
    }

    switch (route.screen) {
        case 'Player':
            yield* playerKeys(action);
            return;
    }
}

export default function* keyboardSaga() {
    yield takeEvery(KEY_QUIT, quit);

    yield takeEvery(
        [
            KEY_PREV_TRACK,
            KEY_NEXT_TRACK,
            KEY_REWIND,
            KEY_FAST_FORWARD,
            KEY_PLAY_PAUSE,
            KEY_SEARCH,
            KEY_HELP,
            KEY_TABULATE
        ],
        handleKey
    );
}
