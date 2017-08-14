import {
    search,
    getArtistAlbumsList,
    getTracksList,
    Album,
    ItemType,
    Track,
    SearchResultItem
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
import { dir as createTempDir } from 'tmp-promise';
import { startContentServer } from './server';
import { createArchive } from './archiver';
import sanitize = require('sanitize-filename');

interface Configuration {
    player: string | undefined;
}

interface TrackListWithTitle {
    tracks: Array<Track>;
    title: string;
}

const defaultConfig: Configuration = {
    player: 'vlc %'
};

const getTracksListInteractively = async (): Promise<TrackListWithTitle> => {
    const searchResultItem = await askSearchTerm();
    let selectedItem: SearchResultItem;
    if (searchResultItem.itemType === ItemType.Artist) {
        const artistAlbumsList = await getArtistAlbumsList(searchResultItem);
        selectedItem = await chooseFromAlbums(artistAlbumsList);
    } else {
        selectedItem = searchResultItem;
    }
    const tracksList = await getTracksList(selectedItem);
    return {
        tracks: tracksList,
        title: selectedItem.label
    };
};

const download = async (conf: Configuration, directory: string) => {
    const tracksList = await getTracksListInteractively();
    await downloadTracks(directory, tracksList.tracks);
};

const playlist = async (conf: Configuration, file: string) => {
    const tracksList = await getTracksListInteractively();
    await savePlaylistFile(tracksList.tracks, file);
};

const play = async (conf: Configuration) => {
    const tracksList = await getTracksListInteractively();
    // console.log(tracksList)
    await playTracks(conf.player, tracksList.tracks);
};

const share = async (conf: Configuration) => {
    const tracksList = await getTracksListInteractively();
    const { path: tmpDir } = await createTempDir({ unsafeCleanup: true });
    const tracksDir = `${tmpDir}/tracks`; //use path.join
    const safeTitle = sanitize(tracksList.title);
    const archiveFile = `${tmpDir}/${safeTitle}.zip`; //use path.join
    await downloadTracks(tracksDir, tracksList.tracks);
    console.log(`Creating archive: ${archiveFile}`);
    await createArchive(tracksDir, archiveFile);
    startContentServer(tmpDir);
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
