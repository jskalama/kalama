import { take, race, takeEvery, call, put } from 'redux-saga/effects';
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
import { delay } from 'redux-saga';

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
    yield race([take(ON_CACHE_READY), delay(200)]);
    yield put(setCurrentTrackIndex(0));
}

function* navigationSaga() {
    yield put(Navigate('Search'));
    yield takeEvery(LOAD_TRACKS_LIST, doLoadTrackList);
    yield takeEvery(ON_PLAYER_SHUTDOWN, doShutdown);
}

export default navigationSaga;
