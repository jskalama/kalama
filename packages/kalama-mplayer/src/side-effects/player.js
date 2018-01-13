import { MPlayer } from 'mplayer-as-promised';

let player, playerItem;

export const playerSetTrack = async (
    dispatch,
    { onPlayerPlaying, onPlayerEnd, onPlayerPrematureEnd },
    track
) => {
    if (playerItem) {
        await playerItem.stop(); //TODO: is needed?
    }
    playerItem = await player.openFile(track.url);
    playerItem.listen().then(
        () => {
            playerItem = null;
            dispatch(onPlayerEnd());
        },
        () => {
            dispatch(onPlayerPrematureEnd());
        }
    );
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
export const playerShutdown = async (dispatch, { onPlayerShutdown }) => {
    await player.shutdown();
    dispatch(onPlayerShutdown());
};
