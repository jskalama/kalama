import { MPlayer } from 'mplayer-as-promised';
import { retryIfBusy, ignoreWhatever } from '../lib/asyncHelpers';

const player = new MPlayer();
let currentItem = null;

const openFile = async url => {
    if (currentItem) {
        await stop();
    }
    currentItem = await retryIfBusy(() => player.openFile(url));
};

const stop = async () => {
    if (currentItem) {
        await retryIfBusy(() => currentItem && currentItem.stop());
    }
    currentItem = null;
};

const play = async () => {
    await retryIfBusy(() => currentItem.play());
};

const pause = async () => {
    await retryIfBusy(() => currentItem.pause());
};

const waitForTrackEnd = async () => {
    try {
        await currentItem.listen();
    } finally {
        currentItem = null;
    }
};

const getPercent = async () => {
    return ignoreWhatever(() => currentItem.getCurrentPercent());
};

const seekBy = async seconds => {
    return ignoreWhatever(() => currentItem.seekBy(seconds));
};

const shutdown = async () => {
    await retryIfBusy(() => player.shutdown());
};

export {
    shutdown,
    openFile,
    stop,
    play,
    pause,
    getPercent,
    waitForTrackEnd,
    seekBy
};
