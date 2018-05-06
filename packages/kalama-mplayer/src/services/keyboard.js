import {
    KEY_QUIT,
    KEY_NEXT_TRACK,
    KEY_PREV_TRACK,
    KEY_REWIND,
    KEY_FAST_FORWARD,
    KEY_PLAY_PAUSE,
    KEY_HELP,
    KEY_TABULATE,
    KEY_DOWNLOAD,
    KEY_QRCODE
} from '../ducks/keyboard';

const keymap = [
    ['C-c', KEY_QUIT, { global: true }],
    ['C-l', KEY_HELP, { global: true }],
    ['C-s', KEY_DOWNLOAD, { global: true }],
    ['escape', KEY_TABULATE, { global: true }],
    ['C-w', KEY_QRCODE, { global: true }],
    ['C-left', KEY_PREV_TRACK],
    ['C-right', KEY_NEXT_TRACK],
    ['left', KEY_REWIND],
    ['right', KEY_FAST_FORWARD],
    ['space', KEY_PLAY_PAUSE]
];

export const getGlobalKeys = () =>
    keymap.filter(([, , { global } = {}]) => global).map(([key]) => key);

export const initKeyboard = (screen, store) => {
    keymap.forEach(([key, action]) => {
        screen.key(key, () => {
            store.dispatch({ type: action });
        });
    });
};
