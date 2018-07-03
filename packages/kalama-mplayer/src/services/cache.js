import { join } from 'path';
import { PlaylistCache } from 'kalama-cache';
import { getResolved } from './conf';

export const createPlaylistCache = async tracks => {
    const { cacheMaxSize } = await getResolved();

    const cache = new PlaylistCache(tracks, {
        concurrency: 4,
        storageDirectory: join(process.env.HOME, '.cache', 'kalama'),
        maxSize: cacheMaxSize
    });

    return cache;
};
