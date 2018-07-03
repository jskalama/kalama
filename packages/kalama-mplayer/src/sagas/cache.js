import { takeEvery, select, call, put } from 'redux-saga/effects';
import {
    SET_TRACKS,
    onCacheStateChange,
    isFirstTrackCached,
    onCacheReady
} from '../ducks/tracks';
import { eventChannel } from 'redux-saga';
import { createPlaylistCache } from '../services/cache';

function* cacheSaga() {
    yield takeEvery(SET_TRACKS, function* onSetTracksStartFetchingCache({
        payload: tracks
    }) {
        const cacheChannel = yield call(playlistCacheChannel, tracks);
        yield takeEvery(cacheChannel, function* onCacheChange(cacheState) {
            yield put(onCacheStateChange(cacheState));
            const isCacheReady = yield select(isFirstTrackCached);
            if (isCacheReady) {
                yield put(onCacheReady());
            }
        });
    });
}

async function playlistCacheChannel(tracks) {
    const cache = await createPlaylistCache(tracks);
    await cache.cleanup(); //TODO: cleanup as often as once in 30 minutes
    return eventChannel(emitter => {
        cache.on('change', emitter);
        cache.fetch();
        return () => {
            cache.removeEventListener('change');
        };
    });
}

export default cacheSaga;
