// Actions
export const ADD_TASKS = 'Download/ADD_TASKS';

// Reducer
const defaultState = {
    tasks: []
};

export default function reducer(state = defaultState, action = {}) {
    const { type, payload } = action;

    switch (type) {
        case ADD_TASKS: {
            return {
                ...state,
                tasks: [...state.tasks, payload]
            };
        }
        default:
            return state;
    }
}

// Action Creators
export const AddTasks = tracks => ({
    type: ADD_TASKS,
    payload: tracks
});
