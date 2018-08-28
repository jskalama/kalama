import { expect } from 'chai';
import {
    ItemType,
    search,
    getArtistAlbumsList,
    getTracksList
} from 'kalama-api';
import snapshot = require('snap-shot-it');
import { join } from 'path';
import { PlaylistCache } from '../kalama-cache';

describe('getTracksList', () => {
    let tracks, cache;

    before(async function() {
        this.timeout(2 * 60 * 1000);
        tracks = await getTracksList({
            itemType: ItemType.Album,
            label: '',
            url:
                'https://myzcloud.me/album/3037660/asd-wer-hatte-das-gedacht-2003'
            // 'https://myzcloud.me/album/3037656/asd-blockbasta-deluxe-edition-2015'
        });
        cache = new PlaylistCache(tracks, {
            storageDirectory: join(
                process.env.HOME,
                '.cache',
                'kalama-cache-test'
            ),
            concurrency: 1,
            maxSize: 500e6
        });
        cache.on('change', () => {
            console.log('.');
        });
        console.time('fetch');
        await cache.fetch();
        console.timeEnd('fetch');
        await cache.cleanup();
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