import { shutdown } from '../ducks/tracks';

let screen;
export const appSetScreen = s => {
    //TODO: unsubscribe from keybindibgs if screen already exists
    screen = s;
};

export const appKeyboardInit = dispatch => {
    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
        dispatch(shutdown());
    });
};

export const appExit = () => {
    process.exit(0);
};
