import { search, getArtistAlbumsList, getTracksList } from './api';

const main = async () => {
    const items = await search('ASD');
    const asd = items.artists[0];
    const asdAlbums = await getArtistAlbumsList(asd);
    const tracks = await getTracksList(asdAlbums[0]);
    console.log(tracks);
};

main();
