import { search, getArtistAlbumsList, getTracksList, Album, ItemType } from './api';
import { askSearchTerm, chooseFromSearchResults } from './inquirer-ui';
import {playTracks} from './cli-player';

const main = async () => {
    const searchResultItem = await askSearchTerm();
    const tracksList = await getTracksList(searchResultItem);
    await playTracks(tracksList);
};

main();
