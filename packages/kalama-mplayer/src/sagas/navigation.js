import { takeEvery, select, call, put, fork, cancel } from 'redux-saga/effects';
import { Navigate } from '../ducks/router';
import { LOAD_TRACKS_LIST } from '../ducks/search';
import { getTracks } from '../services/kalama';
import { setTracks, ON_PLAYER_SHUTDOWN } from '../ducks/tracks';

function* doShutdown() {
    yield call(::process.exit, 0);
}

function* doLoadTrackList({ payload: resource }) {
    const tracks = yield call(getTracks, resource);
    yield put(setTracks(tracks));
    yield put(Navigate('Player'));
}

function* navigationSaga() {
    yield put(Navigate('Search'));
    yield takeEvery(LOAD_TRACKS_LIST, doLoadTrackList);
    yield takeEvery(ON_PLAYER_SHUTDOWN, doShutdown);
}

export default navigationSaga;
