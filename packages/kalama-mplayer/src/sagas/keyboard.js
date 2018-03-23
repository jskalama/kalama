import { takeEvery } from 'redux-saga';
import { KEY_QUIT, KEY_PLAY_PAUSE } from '../ducks/keyboard';
import { togglePause } from '../ducks/tracks';
import { put } from 'redux-saga/effects';

function* quit() {
    process.exit(0);
}

function* doPut(action) {
    yield put(action);
}

export default function* keyboardSaga() {
    yield takeEvery(KEY_QUIT, quit);
    yield takeEvery(KEY_PLAY_PAUSE, doPut, togglePause());
}
