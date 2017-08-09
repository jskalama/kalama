import fs = require('q-io/fs');
import { tmpdir } from 'os';
import { join } from 'path';
import { exec } from 'child-process-promise';
import { Track } from './api';

const PLAYER = 'vlc';

const tracksToM3U = (tracks: Array<Track>): string => {
    return (
        '#EXTM3U\n' +
        tracks.map(({ url, title }) => `#EXTINF:0,${title}\n${url}`).join('\n')
    );
};

const makePlaylistFile = async (tracks: Array<Track>): Promise<string> => {
    const fileName = join(
        tmpdir(),
        Math.floor(Math.random() * 1e6).toString(36) + '.m3u'
    );
    await fs.write(fileName, tracksToM3U(tracks));
    return fileName;
};

export const playTracks = async (tracks: Array<Track>): Promise<void> => {
    const playlistFileName = await makePlaylistFile(tracks);
    await exec(`${PLAYER} ${playlistFileName}`);
};
