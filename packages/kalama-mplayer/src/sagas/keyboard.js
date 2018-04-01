import { takeEvery } from 'redux-saga';
import { KEY_QUIT, KEY_PLAY_PAUSE } from '../ducks/keyboard';
import { togglePause, shutdown } from '../ducks/tracks';
import { put, call, select } from 'redux-saga/effects';
import { getRoute } from '../ducks/router';

function* quit() {
    yield put(shutdown());
}

function* playerKeys({ type }) {
    const route = yield select(getRoute);
    if (route.screen !== 'Player') {
        return;
    }

    switch (type) {
        case KEY_PLAY_PAUSE: {
            yield put(togglePause());
        }
    }
}

export default function* keyboardSaga() {
    yield takeEvery(KEY_QUIT, quit);

    yield takeEvery([KEY_PLAY_PAUSE], playerKeys);
}
