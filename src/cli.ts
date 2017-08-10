import {
    search,
    getArtistAlbumsList,
    getTracksList,
    Album,
    ItemType
} from './api';
import {
    askSearchTerm,
    chooseFromSearchResults,
    chooseFromAlbums
} from './inquirer-ui';
import { playTracks } from './cli-player';
import { downloadTracks } from './downloader';
import yargs = require('yargs');

const download = async (directory: string) => {
    const searchResultItem = await askSearchTerm();
    const tracksList = await getTracksList(searchResultItem);
    await downloadTracks(directory, tracksList);
};

const play = async () => {
    const searchResultItem = await askSearchTerm();
    let selectedItem;
    if (searchResultItem.itemType === ItemType.Artist) {
        const artistAlbumsList = await getArtistAlbumsList(searchResultItem);
        selectedItem = await chooseFromAlbums(artistAlbumsList);
    } else {
        selectedItem = searchResultItem;
    }
    const tracksList = await getTracksList(selectedItem);
    await playTracks(tracksList);
};

const main = async () => {
    yargs
        .command(
            'get <directory>',
            'Download',
            () => {},
            ({ directory }) => {
                download(directory);
            }
        )
        .command(
            ['play', '*'],
            'Play',
            () => {},
            argv => {
                play();
            }
        )
        .help().argv;
};

main();
