import { Track } from 'kalama-api';
import download = require('download');
import { EventEmitter } from 'events';
import md5 = require('md5');
import assert = require('assert');
import { join, dirname, basename } from 'path';
import { move, exists } from 'q-io/fs';
import { keyBy } from 'lodash';

export type TracksList = Array<Track>;
export type FileName = string;
type Hash = string;
interface CacheDescriptor {
    tempFile: FileName;
    file: FileName;
}
export interface CacheItem {
    id: string;
    file: FileName | null;
}

export interface PlaylistCacheOptions {
    storageDirectory: string;
    concurrency: number;
}

export class PlaylistCache extends EventEmitter {
    private retryQueue = [];
    private descriptors: { [id: string]: CacheDescriptor };
    private tracksById: { [id: string]: Track };

    constructor(
        private readonly tracks: TracksList,
        private readonly options: PlaylistCacheOptions
    ) {
        super();
        this.descriptors = this.createCacheDescriptorsList();
        this.tracksById = this.indexTracksById();
    }

    private indexTracksById(): { [id: string]: Track } {
        return keyBy(this.tracks, 'id');
    }

    private createCacheDescriptorsList(): { [id: string]: CacheDescriptor } {
        return keyBy(
            this.tracks.map(t => {
                const path = this.getTrackPath(t);
                return {
                    id: t.id,
                    tempFile: `${path}.download`,
                    file: `${path}.mp3`
                };
            }),
            'id'
        );
    }

    private async fetchTrack(track: Track) {
        const cached = await this.getCachedItem(track);
        if (cached.file) {
            return;
        }

        const { tempFile } = this.descriptors[track.id];

        await download(track.url, dirname(tempFile), {
            filename: basename(tempFile)
        });
        await this.commit(track);
    }

    private async commit(track: Track) {
        const desc = this.descriptors[track.id];
        await move(desc.tempFile, desc.file);
    }

    private getTrackHash(track: Track): Hash {
        assert(track.id);
        // TODO: cache for better performance
        return md5(track.id);
    }

    private getTrackPath(track: Track): FileName {
        const h = this.getTrackHash(track);
        const part0 = h.substr(0, 2);
        const part1 = h.substr(2, 2);
        return join(this.options.storageDirectory, part0, part1, h);
    }

    private async getCachedItem(track: Track) {
        const desc = this.descriptors[track.id];
        const itemExists = await exists(desc.file);
        return { id: track.id, file: itemExists ? desc.file : null };
    }

    public async getCachedItems(): Promise<{ [id: string]: CacheItem }> {
        const { tracks } = this;
        const results = await Promise.all(
            tracks.map(t => this.getCachedItem(t))
        );
        return keyBy(results, 'id');
    }

    public async fetch() {
        const {
            tracks,
            options: { concurrency }
        } = this;
        // TODO: emit events across the process

        await this.fetchTrack(tracks[0]);

        const notCachedItems = Object.values(
            await this.getCachedItems()
        ).filter(_ => !_.file);

        for (let i = 1; i < notCachedItems.length; i += concurrency) {
            await Promise.all(
                notCachedItems
                    .slice(i, i + concurrency)
                    .map(cacheItem =>
                        this.fetchTrack(this.tracksById[cacheItem.id])
                    )
            );
        }
    }
}
