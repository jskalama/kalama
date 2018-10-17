import { shutdown } from './player';

let screen;

export const initSOD = s => {
    screen = s;
};

export const die = error => {
    screen.destroy();
    console.error('Uncaught exception:');
    console.error(error);
    shutdown().finally(() => process.exit(1));
};
