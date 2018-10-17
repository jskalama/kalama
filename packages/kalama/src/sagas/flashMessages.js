import { takeLatest, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { SHOW_MESSAGE, hideMessage } from '../ducks/flashMessages';

export default function* flashMessagesSaga() {
    yield takeLatest(SHOW_MESSAGE, function*() {
        yield delay(2000);
        yield put(hideMessage());
    });
}
