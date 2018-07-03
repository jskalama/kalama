import { take, takeEvery, call, put } from 'redux-saga/effects';
import { Navigate } from '../ducks/router';
import { LOAD_TRACKS_LIST } from '../ducks/search';
import { getTracks } from '../services/kalama';
import {
    setTracks,
    ON_PLAYER_SHUTDOWN,
    setCurrentTrackIndex,
    ON_CACHE_READY
} from '../ducks/tracks';
import { showMessage } from '../ducks/flashMessages';

function* doShutdown() {
    yield call(::process.exit, 0);
}

function* doLoadTrackList({ payload: resource }) {
    const tracks = yield call(getTracks, resource);
    if (!tracks.length) {
        yield put(
            showMessage('No tracks! All tracks are removed by copyright')
        );
        return;
    }
    yield put(setTracks(tracks, resource));
    yield put(Navigate('Player'));
    yield put(setCurrentTrackIndex(0));
}

function* navigationSaga() {
    yield put(Navigate('Search'));
    yield takeEvery(LOAD_TRACKS_LIST, doLoadTrackList);
    yield takeEvery(ON_PLAYER_SHUTDOWN, doShutdown);
}

export default navigationSaga;
