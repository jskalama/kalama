import { expect } from 'chai';
import { ItemType, search, getArtistAlbumsList, getTracksList } from '../api';
import snapshot = require('snap-shot-it');
import {
    expectToBeAValidItem,
    expectToBeAValidPlayableTrack,
    expectToHaveUniqueIds
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
            url: 'https://myzcloud.me/artist/426461/asd'
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
                'https://myzcloud.me/album/3037656/asd-blockbasta-deluxe-edition-2015'
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
                    'https://myzcloud.me/album/3037656/asd-blockbasta-deluxe-edition-2015'
            },
            {
                noResolveRedirects: true
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
                'https://myzcloud.me/album/1105221/joao-gilberto-joao-gilberto-in-tokyo-2004'
        });
        tracks.forEach(expectToBeAValidPlayableTrack);
        expectToHaveUniqueIds(tracks);
    });
});
