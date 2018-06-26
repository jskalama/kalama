import { expect } from 'chai';
import {
    ItemType,
    search,
    getArtistAlbumsList,
    getTracksList
} from 'kalama-api';
import snapshot = require('snap-shot-it');
import { PlaylistCache } from '../kalama-cache';

describe('getTracksList', () => {
    it('should get a list of album tracks', async () => {
        const tracks = await getTracksList({
            itemType: ItemType.Album,
            label: '',
            url:
                'https://myzcloud.me/album/3037656/asd-blockbasta-deluxe-edition-2015'
        });
        snapshot(tracks.map(({ url, ...trackWithoutUrl }) => trackWithoutUrl));

        const cache = new PlaylistCache(tracks, {
            storageDirectory: '/tmp/kalama-cache',
            concurrency: 2
        });

        const cached = await cache.getCachedItems();
        console.log(cached);
        cache.fetch();
        cache.on('change', status => console.log(status));
    });
});
