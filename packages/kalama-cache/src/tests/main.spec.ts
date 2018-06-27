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
    let tracks, cache;

    before(async function() {
        this.timeout(2 * 60 * 1000);
        tracks = await getTracksList({
            itemType: ItemType.Album,
            label: '',
            url:
                'https://myzcloud.me/album/3037656/asd-blockbasta-deluxe-edition-2015'
        });
        cache = new PlaylistCache(tracks, {
            storageDirectory: '/tmp/kalama-cache',
            concurrency: 2
        });
        console.time('fetch');
        await cache.fetch();
        console.timeEnd('fetch');
    });

    it('should get a list of album tracks', async () => {
        snapshot(tracks.map(({ url, ...trackWithoutUrl }) => trackWithoutUrl));
    });

    it('should get cached tracks', async () => {
        console.time('scan for fetched items');
        snapshot(await cache.getCachedItems());
        console.timeEnd('scan for fetched items');
    });
});
