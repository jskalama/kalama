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
    ADD_TASKS,
    ON_TASK_COMPLETED,
    ON_TASK_FAILED,
    getFirstScheduledTask,
    OnTaskRunning,
    OnTaskFailed,
    OnTaskCompleted,
    AddTracksTasks,
    DOWNLOAD_CURRENT_PLST
} from '../ducks/download';
import { performDownloadTask } from '../services/download';
import { getTracks, getParentResourceLabel } from '../ducks/tracks';

export default function* downloadSaga() {
    yield takeEvery(DOWNLOAD_CURRENT_PLST, function* downloadCurrentPlst() {
        const tracks = yield select(getTracks);
        const playlistLabel = yield select(getParentResourceLabel);
        yield put(AddTracksTasks({ tracks, playlistLabel }));
    });

    yield takeEvery(
        [ADD_TASKS, ON_TASK_COMPLETED, ON_TASK_FAILED],
        function* startFirstScheduledTask() {
            const task = yield select(getFirstScheduledTask);
            if (!task) {
                return;
            }
            yield put(OnTaskRunning(task.id));
            try {
                yield call(performDownloadTask, task);
                yield put(OnTaskCompleted(task.id));
            } catch (e) {
                yield put(OnTaskFailed(task.id));
            }
        }
    );
}
