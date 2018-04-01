import { takeEvery } from 'redux-saga';
import {
    KEY_QUIT,
    KEY_PLAY_PAUSE,
    KEY_PREV_TRACK,
    KEY_NEXT_TRACK,
    KEY_REWIND,
    KEY_FAST_FORWARD,
    KEY_SEARCH
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
import { put, call, select } from 'redux-saga/effects';
import { getRoute, Navigate } from '../ducks/router';
import { GoToSearch } from '../ducks/search';

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
        case KEY_SEARCH: {
            yield put(Navigate('Search'));
            yield put(GoToSearch());
            return;
        }
    }
}

function* searchKeys({ type }) {
    switch (type) {
        case KEY_SEARCH: {
            if (yield select(hasTracks)) {
                yield put(Navigate('Player'));
            }
            return;
        }
    }
}

function* handleKey(action) {
    const route = yield select(getRoute);
    switch (route.screen) {
        case 'Player':
            yield* playerKeys(action);
            return;
        case 'Search':
            yield* searchKeys(action);
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
            KEY_SEARCH
        ],
        handleKey
    );
}
