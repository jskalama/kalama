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
    getNextScheduledTask,
    OnTaskRunning,
    OnTaskFailed,
    OnTaskCompleted,
    AddTracksTasks,
    DOWNLOAD_CURRENT_PLST,
    DOWNLOAD_AND_SHARE_CURRENT_PLST,
    TYPE_DOWNLOAD,
    TYPE_ARCHIVE,
    AddTracksAndShareTasks
} from '../ducks/download';
import { performDownloadTask, performArchiveTask } from '../services/download';
import { getTracks, getParentResourceLabel } from '../ducks/tracks';

export default function* downloadSaga() {
    yield takeEvery(DOWNLOAD_CURRENT_PLST, function* downloadCurrentPlst() {
        const tracks = yield select(getTracks);
        const playlistLabel = yield select(getParentResourceLabel);
        yield put(AddTracksTasks({ tracks, playlistLabel }));
    });

    yield takeEvery(
        DOWNLOAD_AND_SHARE_CURRENT_PLST,
        function* downloadAndShareCurrentPlst() {
            const tracks = yield select(getTracks);
            const playlistLabel = yield select(getParentResourceLabel);
            yield put(AddTracksAndShareTasks({ tracks, playlistLabel }));
        }
    );

    yield takeEvery(
        [ADD_TASKS, ON_TASK_COMPLETED, ON_TASK_FAILED],
        function* startNextScheduledTask() {
            const task = yield select(getNextScheduledTask);
            if (!task) {
                return;
            }

            const runner = task.type === TYPE_DOWNLOAD
                ? performDownloadTask
                : task.type === TYPE_ARCHIVE
                    ? performArchiveTask
                    : null;

            yield put(OnTaskRunning(task.id));
            try {
                yield call(runner, task);
                yield put(OnTaskCompleted(task.id));
            } catch (e) {
                yield put(OnTaskFailed(task.id));
            }
        }
    );
}
