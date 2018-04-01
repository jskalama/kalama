import {
    KEY_QUIT,
    KEY_NEXT_TRACK,
    KEY_PREV_TRACK,
    KEY_REWIND,
    KEY_FAST_FORWARD,
    KEY_PLAY_PAUSE,
    KEY_SEARCH
} from '../ducks/keyboard';

const keymap = [
    ['C-c', KEY_QUIT],
    ['C-left', KEY_PREV_TRACK],
    ['C-right', KEY_NEXT_TRACK],
    ['left', KEY_REWIND],
    ['right', KEY_FAST_FORWARD],
    ['space', KEY_PLAY_PAUSE],
    ['C-s', KEY_SEARCH]
];

export const initKeyboard = (screen, store) => {
    keymap.forEach(([key, action]) => {
        screen.key(key, () => store.dispatch({ type: action }));
    });
};
