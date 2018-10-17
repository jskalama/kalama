import { join } from 'path';
import { PlaylistCache } from 'kalama-cache';

export const createPlaylistCache = async (tracks, cacheMaxSize) => {
    const cache = new PlaylistCache(tracks, {
        concurrency: 4,
        storageDirectory: join(process.env.HOME, '.cache', 'kalama'),
        maxSize: cacheMaxSize
    });

    return cache;
};
