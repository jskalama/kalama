import {
    search,
    getArtistAlbumsList,
    getTracksList,
    Album,
    ItemType,
    Track
} from './api';
import {
    askSearchTerm,
    chooseFromSearchResults,
    chooseFromAlbums
} from './inquirer-ui';
import { playTracks, savePlaylistFile } from './cli-player';
import { downloadTracks } from './downloader';
import yargs = require('yargs');
import Configstore = require('configstore');
import { dir } from 'tmp-promise';
import {startContentServer} from './server'

interface Configuration {
    player: string | undefined;
}

const defaultConfig: Configuration = {
    player: 'vlc %'
};

const getTracksListInteractively = async (): Promise<Array<Track>> => {
    const searchResultItem = await askSearchTerm();
    let selectedItem;
    if (searchResultItem.itemType === ItemType.Artist) {
        const artistAlbumsList = await getArtistAlbumsList(searchResultItem);
        selectedItem = await chooseFromAlbums(artistAlbumsList);
    } else {
        selectedItem = searchResultItem;
    }
    return getTracksList(selectedItem);
};

const download = async (conf: Configuration, directory: string) => {
    const tracksList = await getTracksListInteractively();
    await downloadTracks(directory, tracksList);
};

const playlist = async (conf: Configuration, file: string) => {
    const tracksList = await getTracksListInteractively();
    await savePlaylistFile(tracksList, file);
};

const play = async (conf: Configuration) => {
    const tracksList = await getTracksListInteractively();
    await playTracks(conf.player, tracksList);
};

const share = async (conf: Configuration) => {
    const tracksList = await getTracksListInteractively();
    const { path } = await dir({ unsafeCleanup: true });
    await downloadTracks(path, tracksList);
    startContentServer(path);
};

const main = async () => {
    const configstore = new Configstore('kalama', defaultConfig);
    const conf = <Configuration>configstore.all;

    yargs
        .command(
            'get <directory>',
            'Download tracks to the directory',
            () => {},
            ({ directory }) => {
                download(conf, directory);
            }
        )
        .command(
            'playlist <file>',
            'Save playlist file as M3U file',
            () => {},
            ({ file }) => {
                playlist(conf, file);
            }
        )
        .command(
            ['play', '*'],
            'Play',
            () => {},
            argv => {
                play(conf);
            }
        )
        .command(
            ['share', 'qr'],
            'Share a QR code to your mobile phone',
            () => {},
            argv => {
                share(conf);
            }
        )
        .help().argv;
};

main();
