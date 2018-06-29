import { takeEvery, call, put } from 'redux-saga/effects';
import { SET_TRACKS, onCacheStateChange } from '../ducks/tracks';
import { eventChannel } from 'redux-saga';
import { createPlaylistCache } from '../services/cache';

function* cacheSaga() {
    yield takeEvery(SET_TRACKS, function* onSetTracksStartFetchingCache({
        payload: tracks
    }) {
        const cacheChannel = yield call(playlistCacheChannel, tracks);
        yield takeEvery(cacheChannel, function* onCacheChange(cacheState) {
            yield put(onCacheStateChange(cacheState));
        });
    });
}

function playlistCacheChannel(tracks) {
    return eventChannel(emitter => {
        const cache = createPlaylistCache(tracks);
        cache.on('change', emitter);
        cache.fetch();
        return () => {
            cache.removeEventListener('change');
        };
    });
}

export default cacheSaga;
