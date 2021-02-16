import { getArtistAlbumsList, getTracksList, ItemType, search } from '../api';
import {
    expectToBeAValidItem,
    expectToBeAValidPlayableTrack,
    expectToHaveUniqueIds,
} from './expectations';

describe('search', () => {
    it('should return results', async () => {
        const { artists, albums, songs } = await search('asd');
        artists.forEach(expectToBeAValidItem);
        albums.forEach(expectToBeAValidItem);
        songs.forEach(expectToBeAValidItem);
    });
});

describe('getArtistAlbumsList', () => {
    it("should get a list of artist's albums", async () => {
        const albums = await getArtistAlbumsList({
            url: 'https://myzuka.club/Artist/142641/Asd',
        });
        albums.forEach(expectToBeAValidItem);
    });
});

describe('getTracksList', () => {
    it('should get a list of album tracks', async () => {
        const tracks = await getTracksList({
            itemType: ItemType.Album,
            label: '',
            url:
                'https://myzuka.club/Album/802734/Asd-Blockbasta-Deluxe-Edition-2015',
        });
        tracks.forEach(expectToBeAValidPlayableTrack);
        expectToHaveUniqueIds(tracks);
    });

    it('should get a list of album tracks with redirect resolution turned off', async () => {
        const tracks = await getTracksList(
            {
                itemType: ItemType.Album,
                label: '',
                url:
                    'https://myzuka.club/Album/802734/Asd-Blockbasta-Deluxe-Edition-2015',
            },
            {
                noResolveRedirects: true,
            }
        );
        tracks.forEach(expectToBeAValidPlayableTrack);
        expectToHaveUniqueIds(tracks);
    });

    it('should get a list of album tracks even if some of them were removed by copyright holder', async () => {
        const tracks = await getTracksList({
            itemType: ItemType.Album,
            label: '',
            url:
                'https://myzuka.club/Album/297617/Joao-Gilberto-Joao-Gilberto-In-Tokyo-2004',
        });
        tracks.forEach(expectToBeAValidPlayableTrack);
        expectToHaveUniqueIds(tracks);
    });
});
