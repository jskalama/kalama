import { search, getArtistAlbumsList, Album, ItemType } from './api';
import { askSearchTerm, chooseFromSearchResults } from './inquirer-ui';

const main = async () => {
    const searchResultItem = await askSearchTerm();
    console.log(searchResultItem);
};

main();
