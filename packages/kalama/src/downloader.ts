import download = require('download');
import { Track } from 'kalama-api';

const FALLBACK_EXTENSION = '.mp3';

const generateFallbackFileNames = (tracks: Array<Track>): Array<string> => {
    const usedLabels = new Set();
    return tracks.map((track, i) => {
        const initialLabel = track.title.length ? track.title : 'Untitled';
        let label = initialLabel;
        let counter = i;
        while (usedLabels.has(label)) {
            label = `${initialLabel}${(i++).toString()}`;
        }
        usedLabels.add(label);
        return label;
    });
};

export const downloadTracks = async (
    dir: string,
    tracks: Array<Track>
): Promise<void> => {
    console.log(`Downloading files to ${dir}`);
    const fallbackNames = generateFallbackFileNames(tracks);
    for (let i = 0, l = tracks.length; i < l; i++) {
        const track = tracks[i];
        console.log(`${i + 1}/${l} - ${track.title}`);
        try {
            await download(track.url, dir);
        } catch (e) {
            if (e.message && /invalid parameter format/.test(e.message)) {
                await download(track.url, dir, {
                    filename: `${fallbackNames[i]}${FALLBACK_EXTENSION}`
                });
            }
        }
    }
    console.log('Download complete');
};
