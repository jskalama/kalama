import { join } from 'path';
import { PlaylistCache } from 'kalama-cache';

export const createPlaylistCache = tracks => {
    const cache = new PlaylistCache(tracks, {
        concurrency: 2,
        storageDirectory: join(process.env.HOME, '.cache', 'kalama')
    });

    return cache;
};
