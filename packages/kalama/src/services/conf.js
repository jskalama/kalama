import conf, { resolve } from '../lib/config';

export const getResolved = () => {
    return resolve();
};

export const getAll = () => {
    return conf.all;
};

export const set = (k, v) => {
    return conf.set(k, v);
};
