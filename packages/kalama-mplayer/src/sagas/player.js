import { takeEvery, select, call, put, fork, cancel } from 'redux-saga/effects';
import {
    INIT,
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
    onPlayerCurrentTimeChanged
} from '../ducks/tracks';
import { MPlayer } from 'mplayer-as-promised';
import { retryIfBusy, ignoreWhatever } from '../lib/asyncHelpers';
import sleep from 'sleep-promise';

function* playerSaga() {
    let player, playerItem;

    yield takeEvery(INIT, function() {
        player = new MPlayer();
    });

    yield takeEvery(TOGGLE_PAUSE, function*() {
        const isPaused = (yield select()).tracks.isPaused;
        if (isPaused) {
            yield call(retryIfBusy, ::playerItem.pause);
            yield put(onPlayerPaused());
        } else {
            yield call(retryIfBusy, ::playerItem.play);
            yield put(onPlayerPlaying());
        }
    });

    yield takeEvery(
        [SET_CURRENT_TRACK_INDEX, GO_TO_NEXT_TRACK, GO_TO_PREV_TRACK],
        function*() {
            const state = yield select();
            const tracks = state.tracks.tracks;
            const track = tracks[state.tracks.current];
            if (playerItem) {
                yield call(retryIfBusy, ::playerItem.stop); //TODO: is needed?
            }
            playerItem = yield call(retryIfBusy, () =>
                player.openFile(track.url)
            );

            yield put(onPlayerPlaying());
            const positionPollerTask = yield fork(positionPoller, playerItem);
            try {
                yield call(::playerItem.listen);
                playerItem = null;
                yield put(onPlayerEnd());
            } catch (e) {
                yield put(onPlayerPrematureEnd());
            } finally {
                yield cancel(positionPollerTask);
            }
        }
    );

    yield takeEvery(STEP_BACK, function*() {
        yield call(ignoreWhatever, () => playerItem.seekBy(-10));
    });

    yield takeEvery(STEP_FORWARD, function*() {
        yield call(ignoreWhatever, () => playerItem.seekBy(10));
    });
}

function* positionPoller(playerItem) {
    try {
        yield put(onPlayerCurrentTimeChanged(0));
        while (true) {
            const percent = yield call(ignoreWhatever, () =>
                playerItem.getCurrentPercent()
            );
            yield put(onPlayerCurrentTimeChanged(percent));
            yield call(sleep, 1000);
        }
    } finally {
        yield put(onPlayerCurrentTimeChanged(0));
    }
}

export default playerSaga;
