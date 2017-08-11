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
}

const download = async (directory: string) => {
    const tracksList = await getTracksListInteractively();
    await downloadTracks(directory, tracksList);
};

const play = async () => {
    const tracksList = await getTracksListInteractively();
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
