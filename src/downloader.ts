import download = require('download');
import { Track } from './api';

export const downloadTracks = async (
    dir: string,
    tracks: Array<Track>
): Promise<void> => {
    for (let i = 0, l = tracks.length; i < l; i++) {
        const track = tracks[i];
        console.log(`${i + 1}/${l} - ${track.title}`);
        await download(track.url, dir);
    }
};
