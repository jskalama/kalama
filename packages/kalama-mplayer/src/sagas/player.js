import {
    takeEvery,
    takeLatest,
    select,
    call,
    put,
    fork,
    cancel
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
    onPlayerShutdown,
    setPlayerInteractive,
    DIRECT_TRACK_SELECT,
    isPlayerInteractive,
    setCurrentTrackIndex,
    isPlayerPaused,
    getCurrentTrack,
    VOLUME_DOWN,
    VOLUME_UP
} from '../ducks/tracks';
import sleep from 'sleep-promise';
import * as P from '../services/player';
import * as C from '../services/conf';
import { showMessage } from '../ducks/flashMessages';

function* playerSaga() {
    yield takeEvery(TOGGLE_PAUSE, function*() {
        const isPaused = yield select(isPlayerPaused);
        if (isPaused) {
            yield call(P.pause);
            yield put(onPlayerPaused());
        } else {
            yield call(P.play);
            yield put(onPlayerPlaying());
        }
    });

    yield takeLatest(
        [SET_CURRENT_TRACK_INDEX, GO_TO_NEXT_TRACK, GO_TO_PREV_TRACK],
        function*() {
            const track = yield select(getCurrentTrack);

            try {
                yield call(P.openFile, track.url);

                yield put(onPlayerPlaying());
                const positionPollerTask = yield fork(positionPoller);
                const volumeControlTask = yield fork(volumeControl);
                try {
                    yield put(setPlayerInteractive(true));
                    yield call(P.waitForTrackEnd);
                    yield put(onPlayerEnd());
                    yield put(goToNextTrack());
                } catch (e) {
                    yield put(onPlayerPrematureEnd());
                } finally {
                    yield put(setPlayerInteractive(false));
                    yield cancel(positionPollerTask);
                    yield cancel(volumeControlTask);
                }
            } finally {
                // yield put(setPlayerInteractive(false));
            }
        }
    );

    yield takeEvery(DIRECT_TRACK_SELECT, function*({ payload: trackIndex }) {
        const isInteractive = yield select(isPlayerInteractive);
        if (isInteractive) {
            yield put(setCurrentTrackIndex(trackIndex));
        }
    });

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

function* volumeControl() {
    const config = yield call(C.getResolved);
    let volume = parseInt(config.volume, 10);
    if (isNaN(volume)) {
        volume = 50;
    }

    yield takeEvery(
        [VOLUME_DOWN, VOLUME_UP],

        function* onVolumeUpOrDown({ type }) {
            switch (type) {
                case VOLUME_UP:
                    volume = volume + 10;
                    break;
                case VOLUME_DOWN:
                    volume = volume - 10;
                    break;
                default:
                    break;
            }
            if (volume > 100) {
                volume = 100;
            }
            if (volume < 0) {
                volume = 0;
            }
            yield call(P.setVolume, volume);
            yield call(C.set, 'volume', volume);
            yield put(showMessage(`Volume: ${volume}%`));
        }
    );
}

function* positionPoller() {
    try {
        yield put(onPlayerCurrentTimeChanged(0));
        while (true) {
            const isPaused = yield select(isPlayerPaused);
            if (!isPaused) {
                const percent = yield call(P.getPercent);
                if (percent !== null) {
                    yield put(onPlayerCurrentTimeChanged(percent));
                }
            }
            yield call(sleep, 1000);
        }
    } finally {
        yield put(onPlayerCurrentTimeChanged(0));
    }
}

export default playerSaga;
