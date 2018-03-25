import { ON_QUERY_CHANGE, OnQueryResult } from '../ducks/search';
import {
    call,
    put,
    take,
    fork,
    cancel,
    actionChannel
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { search } from '../services/kalama';

function* doSearch(payload) {
    yield delay(500);
    const suggestions = yield call(search, payload);
    yield put(OnQueryResult(suggestions));
}

export default function* searchSaga() {
    let searchTask;
    const chan = yield actionChannel(ON_QUERY_CHANGE);
    while (true) {
        const { payload } = yield take(chan);
        if (searchTask) {
            yield cancel(searchTask);
        }
        searchTask = yield fork(doSearch, payload);
    }
}
