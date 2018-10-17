export const MAX_VOLUME = 30;
export const DEFAULT_VOLUME = 20;
export const MIN_VOLUME = 0;
export const VOLUME_STEP = 2;

export const normalize = vol => {
    return Math.round(100 * vol / MAX_VOLUME);
};

export const limit = vol => {
    if (vol > MAX_VOLUME) {
        return MAX_VOLUME;
    }
    if (vol < MIN_VOLUME) {
        return MIN_VOLUME;
    }
    return vol;
};
