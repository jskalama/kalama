import fs = require('q-io/fs');
import { tmpdir } from 'os';
import { join } from 'path';
import { exec } from 'child-process-promise';
import { Track } from 'kalama-api';

const tracksToM3U = (tracks: Array<Track>): string => {
    //TODO: prevent injection!!!!
    return (
        '#EXTM3U\n' +
        tracks.map(({ url, title }) => `#EXTINF:0,${title}\n${url}`).join('\n')
    );
};

const getTmpPlaylistFile = (): string => {
    return join(
        tmpdir(),
        Math.floor(Math.random() * 1e6).toString(36) + '.m3u'
    );
};

const makePlaylistFile = async (tracks: Array<Track>): Promise<string> => {
    const fileName = getTmpPlaylistFile();
    await savePlaylistFile(tracks, fileName);
    return fileName;
};

export const savePlaylistFile = async (
    tracks: Array<Track>,
    fileName: string
): Promise<void> => {
    await fs.write(fileName, tracksToM3U(tracks));
};

const getPlayerCommandFromTemplate = (
    commandTemplate: string,
    file: string
): string => {
    return commandTemplate.replace(/%/g, file);
};

export const playTracks = async (
    player: string,
    tracks: Array<Track>
): Promise<void> => {
    const playlistFileName = await makePlaylistFile(tracks);
    await exec(getPlayerCommandFromTemplate(player, playlistFileName));
};
