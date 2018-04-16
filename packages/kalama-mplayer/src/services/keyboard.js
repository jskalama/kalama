import {
    KEY_QUIT,
    KEY_NEXT_TRACK,
    KEY_PREV_TRACK,
    KEY_REWIND,
    KEY_FAST_FORWARD,
    KEY_PLAY_PAUSE,
    KEY_SEARCH,
    KEY_HELP,
    KEY_TABULATE,
    KEY_DOWNLOAD
} from '../ducks/keyboard';

const keymap = [
    ['C-c', KEY_QUIT],
    ['C-left', KEY_PREV_TRACK],
    ['C-right', KEY_NEXT_TRACK],
    ['left', KEY_REWIND],
    ['right', KEY_FAST_FORWARD],
    ['space', KEY_PLAY_PAUSE],
    ['C-s', KEY_SEARCH],
    ['C-l', KEY_HELP],
    ['C-s', KEY_DOWNLOAD],
    ['escape', KEY_TABULATE],
];

export const initKeyboard = (screen, store) => {
    keymap.forEach(([key, action]) => {
        screen.key(key, () => {
            store.dispatch({ type: action });
        });
    });
};
