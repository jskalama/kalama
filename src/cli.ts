import {
    search,
    getArtistAlbumsList,
    getTracksList,
    Album,
    ItemType
} from './api';
import { askSearchTerm, chooseFromSearchResults } from './inquirer-ui';
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
    const tracksList = await getTracksList(searchResultItem);
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
