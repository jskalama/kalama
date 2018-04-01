import {
    ON_QUERY_CHANGE,
    OnQueryResult,
    OnAlbumsResult,
    ON_SUGGECTION_SELECT,
    GoToAlbums,
    LoadTracksList,
    ON_ALBUM_SELECT
} from '../ducks/search';
import {
    actionChannel,
    all,
    call,
    cancel,
    fork,
    put,
    take,
    takeEvery
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { search, getAlbums } from '../services/kalama';
import { ItemType } from 'kalama-api';

function* doSearch(payload) {
    yield delay(500);
    const query = payload.trim();
    try {
        const suggestions = yield call(search, query);
        yield put(OnQueryResult(suggestions));
    } catch (e) {
        yield put(OnQueryResult([]));
    }
}

function* autocompleteSaga() {
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

function* stepsSaga() {
    yield takeEvery([ON_SUGGECTION_SELECT, ON_ALBUM_SELECT], function*({
        type,
        payload: suggestion
    }) {
        if (type === ON_ALBUM_SELECT) {
            yield put(LoadTracksList(suggestion));
            return;
        }

        if (suggestion.itemType === ItemType.Artist) {
            const artist = suggestion;
            const albums = yield call(getAlbums, artist);
            yield put(OnAlbumsResult(albums));
            yield put(GoToAlbums());
            return;
        }

        yield put(LoadTracksList(suggestion));
    });
}

export default function* searchSaga() {
    yield all([autocompleteSaga(), stepsSaga()]);
}
