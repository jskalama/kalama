import { MPlayer } from 'mplayer-as-promised';
import {
    onPlayerEnd,
    onPlayerPaused,
    onPlayerPlaying,
    onPlayerPrematureEnd,
    onPlayerShutdown,
    onPlayerCurrentTimeChanged
} from '../ducks/tracks';
import { retryIfBusy, ignoreWhatever } from '../lib/asyncHelpers';

let player, playerItem;

// export const playerSetTrack = async (dispatch, track) => {
//     if (playerItem) {
//         await retryIfBusy(() => playerItem.stop()); //TODO: is needed?
//     }
//     playerItem = await retryIfBusy(() => player.openFile(track.url));
//     playerItem.listen().then(
//         () => {
//             playerItem = null;
//             dispatch(onPlayerEnd());
//         },
//         () => {
//             dispatch(onPlayerPrematureEnd());
//         }
//     );
//     dispatch(onPlayerPlaying());
// };

// export const playerSetPaused = async (dispatch, isPaused) => {
//     if (isPaused) {
//         await retryIfBusy(() => playerItem.pause());
//         // await playerItem.pause();
//         dispatch(onPlayerPaused());
//     } else {
//         await retryIfBusy(() => playerItem.play());
//         // await playerItem.play();
//         dispatch(onPlayerPlaying());
//     }
// };

// export const playerStepBack = async () => {
//     ignoreWhatever(() => playerItem.seekBy(-10));
// };

// export const playerStepForward = async () => {
//     ignoreWhatever(() => playerItem.seekBy(10));
// };

export const playerGetTime = async dispatch => {
    const timeSeconds = await ignoreWhatever(() =>
        playerItem.getCurrentPercent()
    );
    dispatch(onPlayerCurrentTimeChanged(timeSeconds));
};

// export const playerInit = () => {
//     player = new MPlayer();
// };

export const playerShutdown = async dispatch => {
    await retryIfBusy(() => player.shutdown());
    dispatch(onPlayerShutdown());
};
