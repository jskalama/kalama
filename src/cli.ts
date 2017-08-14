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
import { playTracks } from './cli-player';
import { downloadTracks } from './downloader';
import yargs = require('yargs');
import Configstore = require('configstore');

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

const play = async (conf: Configuration) => {
    const tracksList = await getTracksListInteractively();
    await playTracks(conf.player, tracksList);
};

const main = async () => {
    const configstore = new Configstore('kalama', defaultConfig);
    const conf = <Configuration>configstore.all;
    console.log(conf);

    yargs
        .command(
            'get <directory>',
            'Download',
            () => {},
            ({ directory }) => {
                download(conf, directory);
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
        .help().argv;
};

main();
