import uid from 'uid';
import { keyBy, countBy } from 'lodash';
import sanitize from 'sanitize-filename';

// Constants

export const STATUS_SCHEDULED = 'STATUS_SCHEDULED';
export const STATUS_RUNNING = 'STATUS_RUNNING';
export const STATUS_COMPLETED = 'STATUS_COMPLETED';
export const STATUS_FAILED = 'STATUS_FAILED';

const playlistLabelToFolderName = label => {
    const sanitized = sanitize(label, { replacement: '-' });
    if (sanitized === '') {
        return 'Unknown';
    }
    return sanitized;
};
const trackToTask = track => ({
    id: uid(),
    url: track.url,
    title: track.title,
    status: STATUS_SCHEDULED
});

// Actions
export const ADD_TASKS = 'Download/ADD_TASKS';
export const SET_TASK_STATUS = 'Download/SET_TASK_STATUS';
export const ON_TASK_COMPLETED = 'Download/ON_TASK_COMPLETED';
export const ON_TASK_RUNNING = 'Download/ON_TASK_RUNNING';
export const ON_TASK_FAILED = 'Download/ON_TASK_FAILED';
export const DOWNLOAD_CURRENT_PLST = 'Download/DOWNLOAD_CURRENT_PLST';
export const DOWNLOAD_AND_SHARE_CURRENT_PLST =
    'Download/DOWNLOAD_AND_SHARE_CURRENT_PLST';

// Reducer
const defaultState = {
    tasks: {}
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

//Selectors
export const getTasks = state => state.download.tasks;
export const getTasksSummary = state => countBy(getTasks(state), 'status');
export const getFirstScheduledTask = state =>
    Object.values(getTasks(state)).filter(
        t => t.status === STATUS_SCHEDULED
    )[0];
