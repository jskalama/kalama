import { expect } from 'chai';
import { ItemType, search, getArtistAlbumsList, getTracksList } from '../api';
import snapshot = require('snap-shot-it');

describe('search', () => {
    it('should return results', async () => {
        const { artists, albums, songs } = await search('asd');
        snapshot(artists);
        snapshot(albums[0]);
        snapshot(songs);
    });
});

describe('getArtistAlbumsList', () => {
    it("should get a list of artist's albums", async () => {
        const albums = await getArtistAlbumsList({
            url: 'https://myzuka.me/Artist/142641/Asd'
        });
        snapshot(albums);
    });
});

describe('getTracksList', () => {
    it("should get a list of artist's albums", async () => {
        const tracks = await getTracksList({
            itemType: ItemType.Album,
            label: '',
            url:
                'https://myzuka.me/Album/802734/Asd-Blockbasta-Deluxe-Edition-2015'
        });
        snapshot(tracks);
    });
});
