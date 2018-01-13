import { MPlayer } from 'mplayer-as-promised';

let player, playerItem;

export const playerSetTrack = async (
    dispatch,
    { onPlayerPlaying, onPlayerPlayend },
    track
) => {
    if (playerItem) {
        await playerItem.stop(); //TODO: is needed?
    }
    playerItem = await player.openFile(track.url);
    playerItem.listen().then(() => {
        playerItem = null;
        dispatch(onPlayerPlayend());
    });
    dispatch(onPlayerPlaying());
};

export const playerSetPaused = async (
    dispatch,
    { onPlayerPlaying, onPlayerPaused },
    isPaused
) => {
    if (isPaused) {
        await playerItem.pause();
        dispatch(onPlayerPaused());
    } else {
        await playerItem.play();
        dispatch(onPlayerPlaying());
    }
};

export const playerInit = dispatch => {
    player = new MPlayer();
};
