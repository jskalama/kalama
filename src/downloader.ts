import download = require('download');
import { Track } from './api';

export const downloadTracks = async (
    dir: string,
    tracks: Array<Track>
): Promise<void> => {
    for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        console.log(`downloading track #${i}`);
        await download(track.url, dir);
    }
};
