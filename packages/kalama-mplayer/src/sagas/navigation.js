import { takeEvery, select, call, put, fork, cancel } from 'redux-saga/effects';
import { Navigate } from '../ducks/router';
import { LOAD_TRACKS_LIST } from '../ducks/search';
import { getTracks } from '../services/kalama';
import { setTracks } from '../ducks/tracks';

function* doLoadTrackList({ payload: resource }) {
    const tracks = yield call(getTracks, resource);
    yield put(setTracks(tracks));
    yield put(Navigate('Player'));
}

function* navigationSaga() {
    yield put(Navigate('Search'));
    yield takeEvery(LOAD_TRACKS_LIST, doLoadTrackList);
}

export default navigationSaga;
