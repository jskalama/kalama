import {
    takeEvery,
    takeLatest,
    select,
    call,
    put,
    fork,
    cancel,
    cancelled
} from 'redux-saga/effects';
import {
    TOGGLE_PAUSE,
    onPlayerPaused,
    onPlayerPlaying,
    SET_CURRENT_TRACK_INDEX,
    onPlayerEnd,
    onPlayerPrematureEnd,
    GO_TO_NEXT_TRACK,
    GO_TO_PREV_TRACK,
    STEP_BACK,
    STEP_FORWARD,
    onPlayerCurrentTimeChanged,
    goToNextTrack,
    SHUTDOWN,
    onPlayerShutdown
} from '../ducks/tracks';
import sleep from 'sleep-promise';
import * as P from '../services/player';

function* playerSaga() {
    yield takeEvery(TOGGLE_PAUSE, function*() {
        const isPaused = (yield select()).tracks.isPaused;
        if (isPaused) {
            yield call(P.pause);
            yield put(onPlayerPaused());
        } else {
            yield call(P.play);
            yield put(onPlayerPlaying());
        }
    });

    let isOpeningFile = false;

    yield takeLatest(
        [SET_CURRENT_TRACK_INDEX, GO_TO_NEXT_TRACK, GO_TO_PREV_TRACK],
        function*({ type, payload }) {
            const state = yield select();
            const tracks = state.tracks.tracks;
            const track = tracks[state.tracks.current];

            if (isOpeningFile) {
                console.log('OPENING');
                return;
            }
            try {
                isOpeningFile = true;
                yield call(P.openFile, track.url);
                isOpeningFile = false;

                yield put(onPlayerPlaying());
                const positionPollerTask = yield fork(positionPoller);
                try {
                    yield call(P.waitForTrackEnd);
                    yield put(onPlayerEnd());
                    yield put(goToNextTrack());
                } catch (e) {
                    yield put(onPlayerPrematureEnd());
                } finally {
                    yield cancel(positionPollerTask);
                }
            } finally {
                if (yield cancelled()) {
                    isOpeningFile = false;
                }
            }
        }
    );

    yield takeEvery(STEP_BACK, function*() {
        yield call(P.seekBy, -10);
    });

    yield takeEvery(STEP_FORWARD, function*() {
        yield call(P.seekBy, 10);
    });

    yield takeEvery(SHUTDOWN, function*() {
        yield call(P.shutdown);
        yield put(onPlayerShutdown());
    });
}

function* positionPoller() {
    try {
        yield put(onPlayerCurrentTimeChanged(0));
        while (true) {
            const percent = yield call(P.getPercent);
            if (percent !== null) {
                yield put(onPlayerCurrentTimeChanged(percent));
            }
            yield call(sleep, 1000);
        }
    } finally {
        yield put(onPlayerCurrentTimeChanged(0));
    }
}

export default playerSaga;
