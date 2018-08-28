import { MPlayer } from 'kalama-mplayer-as-promised';
import { retryIfBusy, ignoreWhatever } from '../lib/asyncHelpers';
import upath from 'upath';

const player = new MPlayer();
let currentItem = null;

const isRemote = url => {
    return url.startsWith('https://') || url.startsWith('http://');
};

const normalizeUrl = url => {
    if (!isRemote(url)) {
        return upath.normalize(url);
    }
    return url;
};

export const openFile = async (url, startupVolume = 20) => {
    if (currentItem) {
        await shutdown();
    }
    player.setStartupVolume(startupVolume);
    currentItem = await retryIfBusy(() => player.openFile(normalizeUrl(url)));
};

export const stop = async () => {
    if (currentItem) {
        await retryIfBusy(() => currentItem && currentItem.stop());
    }
    currentItem = null;
};

export const play = async () => {
    await retryIfBusy(() => currentItem.play());
};

export const pause = async () => {
    await retryIfBusy(() => currentItem.pause());
};

export const waitForTrackEnd = async () => {
    try {
        await currentItem.listen();
    } finally {
        currentItem = null;
    }
};

export const getPercent = async () => {
    return ignoreWhatever(() => currentItem.getCurrentPercent());
};

export const seekBy = async seconds => {
    return ignoreWhatever(() => currentItem.seekBy(seconds));
};

export const setVolume = async vol => {
    return ignoreWhatever(() => currentItem.setVolume(vol));
};

export const getVolume = async () => {
    return retryIfBusy(() => currentItem.getVolume());
};

export const shutdown = async () => {
    await retryIfBusy(() => player.shutdown());
};
