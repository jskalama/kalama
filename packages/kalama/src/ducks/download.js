import uid from 'uid';
import { keyBy, countBy } from 'lodash';
import sanitize from 'sanitize-filename';
import { getFileNames } from './tracks/getFileNames';
import { createSelector } from 'reselect';
import { getTracks } from './tracks';

// Constants

export const STATUS_SCHEDULED = 'STATUS_SCHEDULED';
export const STATUS_RUNNING = 'STATUS_RUNNING';
export const STATUS_COMPLETED = 'STATUS_COMPLETED';
export const STATUS_FAILED = 'STATUS_FAILED';
export const TYPE_DOWNLOAD = 'TYPE_DOWNLOAD';
export const TYPE_ARCHIVE = 'TYPE_ARCHIVE';

// Helpers

const playlistLabelToFolderName = label => {
    const sanitized = sanitize(label, { replacement: '-' });
    if (sanitized === '') {
        return 'Unknown';
    }
    return sanitized;
};

const trackToTask = track => ({
    type: TYPE_DOWNLOAD,
    id: uid(),
    url: track.url,
    cacheFile: track.cacheFile,
    title: track.title,
    status: STATUS_SCHEDULED,
    fileName: track.fileName
});

const tasksToArchiveTask = (folderName, tasks) => ({
    id: uid(),
    type: TYPE_ARCHIVE,
    waitForIds: tasks.map(_ => _.id),
    folderName,
    status: STATUS_SCHEDULED
});

const isArchiveTaskAndReady = (t, all) => {
    if (t.status !== STATUS_SCHEDULED) {
        return false;
    }
    if (t.type !== TYPE_ARCHIVE) {
        return false;
    }
    const waitForIdsSet = new Set(t.waitForIds);
    return all
        .filter(_ => waitForIdsSet.has(_.id))
        .every(_ => _.status === STATUS_COMPLETED);
};

// Actions
export const ADD_TASKS = 'Download/ADD_TASKS';
export const SET_TASK_STATUS = 'Download/SET_TASK_STATUS';
export const ON_TASK_COMPLETED = 'Download/ON_TASK_COMPLETED';
export const ON_TASK_RUNNING = 'Download/ON_TASK_RUNNING';
export const ON_TASK_FAILED = 'Download/ON_TASK_FAILED';
export const DOWNLOAD_CURRENT_PLST = 'Download/DOWNLOAD_CURRENT_PLST';
export const DOWNLOAD_AND_SHARE_CURRENT_PLST =
    'Download/DOWNLOAD_AND_SHARE_CURRENT_PLST';
export const SET_DOWNLOAD_DIR = 'SET_DOWNLOAD_DIR';

// Reducer
const defaultState = {
    tasks: {},
    downloadDir: null //just for display purposes
};

const updateTasksStatus = (tasks, id, status) => {
    return { ...tasks, [id]: { ...tasks[id], status } };
};

export default function reducer(state = defaultState, action = {}) {
    const { type, payload } = action;

    switch (type) {
        case ADD_TASKS: {
            return {
                ...state,
                tasks: { ...state.tasks, ...keyBy(payload, 'id') }
            };
        }
        case SET_DOWNLOAD_DIR: {
            return {
                ...state,
                downloadDir: action.payload
            };
        }
        case SET_TASK_STATUS: {
            const { id, status } = payload;
            return {
                ...state,
                tasks: updateTasksStatus(state.tasks, id, status)
            };
        }
        case ON_TASK_COMPLETED: {
            const { id } = payload;
            return {
                ...state,
                tasks: updateTasksStatus(state.tasks, id, STATUS_COMPLETED)
            };
        }
        case ON_TASK_RUNNING: {
            const { id } = payload;
            return {
                ...state,
                tasks: updateTasksStatus(state.tasks, id, STATUS_RUNNING)
            };
        }
        case ON_TASK_FAILED: {
            const { id } = payload;
            return {
                ...state,
                tasks: updateTasksStatus(state.tasks, id, STATUS_FAILED)
            };
        }
        default:
            return state;
    }
}

// Action Creators
export const AddTracksTasks = ({ tracks, playlistLabel }) => {
    const folderName = playlistLabelToFolderName(playlistLabel);
    const tasks = tracks.map(trackToTask).map(t => ({ ...t, folderName }));
    return {
        type: ADD_TASKS,
        payload: tasks
    };
};

export const AddTracksAndShareTasks = ({ tracks, playlistLabel }) => {
    const folderName = playlistLabelToFolderName(playlistLabel);
    const tasks = tracks.map(trackToTask).map(t => ({ ...t, folderName }));
    const archiveTask = tasksToArchiveTask(folderName, tasks);
    return {
        type: ADD_TASKS,
        payload: [...tasks, archiveTask]
    };
};

export const OnTaskCompleted = id => ({
    type: ON_TASK_COMPLETED,
    payload: { id }
});
export const OnTaskRunning = id => ({
    type: ON_TASK_RUNNING,
    payload: { id }
});
export const OnTaskFailed = id => ({
    type: ON_TASK_FAILED,
    payload: { id }
});
export const DownloadCurrentPlst = () => ({
    type: DOWNLOAD_CURRENT_PLST
});
export const DownloadAndShareCurrentPlst = () => ({
    type: DOWNLOAD_AND_SHARE_CURRENT_PLST
});
export const SetDownloadDir = dir => ({
    type: SET_DOWNLOAD_DIR,
    payload: dir
});

//Selectors

export const getTasks = state => state.download.tasks;

export const getTasksSummary = state => countBy(getTasks(state), 'status');

export const getNextScheduledTask = state => {
    return Object.values(getTasks(state)).find(
        (t, i, allTasks) =>
            (t.type === TYPE_DOWNLOAD && t.status === STATUS_SCHEDULED) ||
            isArchiveTaskAndReady(t, allTasks)
    );
};

export const getDownloadDir = state => state.download.downloadDir;

// Memoized Selectors

export const getDownloadableTracks = createSelector(getTracks, tracks => {
    const fileNames = getFileNames(tracks);
    return tracks.map((track, i) => ({ ...track, fileName: fileNames[i] }));
});
