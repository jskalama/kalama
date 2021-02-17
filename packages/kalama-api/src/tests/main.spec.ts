import { expect } from 'chai';
import { getArtistAlbumsList, getTracksList, ItemType, search } from '../api';
import {
    expectToBeAValidItem,
    expectToBeAValidPlayableTrack,
    expectToHaveUniqueIds,
} from './expectations';

describe('search', () => {
    it('should return results', async () => {
        const { artists, albums, songs } = await search('asd');
        
        expect(artists.length).to.be.greaterThan(0);
        expect(albums.length).to.be.greaterThan(0);
        expect(songs.length).to.be.greaterThan(0);

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
        
        expect(albums.length).to.be.greaterThan(0);

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

        expect(tracks.length).to.be.greaterThan(0);

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
        expect(tracks.length).to.be.greaterThan(0);
        
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
        expect(tracks.length).to.be.greaterThan(0);

        tracks.forEach(expectToBeAValidPlayableTrack);
        expectToHaveUniqueIds(tracks);
    });
});
