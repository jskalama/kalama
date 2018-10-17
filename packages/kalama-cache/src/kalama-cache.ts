import { Track } from 'kalama-api';
import download = require('download');
import { EventEmitter } from 'events';
import md5 = require('md5');
import assert = require('assert');
import { join, dirname, basename } from 'path';
import { move, exists, stat, remove } from 'q-io/fs';
import { keyBy, fromPairs } from 'lodash';
import { IndexStorage } from './IndexStorage';

export type TracksList = Array<Track>;
export type FileName = string;
export type Hash = string;
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
    maxSize: number;
}

export class PlaylistCache extends EventEmitter {
    private retryQueue = [];
    private descriptors: { [id: string]: CacheDescriptor };
    private tracksById: { [id: string]: Track };
    private storage: IndexStorage;
    private hashesById: { [id: string]: Hash };

    constructor(
        private readonly tracks: TracksList,
        private readonly options: PlaylistCacheOptions
    ) {
        super();
        this.hashesById = this.createHashList();
        this.descriptors = this.createCacheDescriptorsList();
        this.tracksById = this.indexTracksById();
        this.storage = new IndexStorage(this.options.storageDirectory);
    }

    private indexTracksById(): { [id: string]: Track } {
        return keyBy(this.tracks, 'id');
    }

    private createHashList(): { [id: string]: Hash } {
        return fromPairs(
            this.tracks.map(track => [track.id, this.getTrackHash(track)])
        );
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

    private reportCachedItems(items: { [id: string]: CacheItem }) {
        this.emit('change', items);
    }

    private async fetchTrack(track: Track) {
        const { id, url } = track;
        const {
            storage,
            hashesById: { [id]: hash }
        } = this;

        const cached = await this.getCachedItem(track);
        if (cached.file) {
            this.reportCachedItems({ [id]: cached });
            await this.saveToIndex(track);
            return;
        }

        const { tempFile, file } = this.descriptors[id];

        await download(url, dirname(tempFile), {
            filename: basename(tempFile)
        });

        await this.commit(track);
        await this.saveToIndex(track);

        this.reportCachedItems({ [id]: { file, id } });
    }

    private async saveToIndex(track) {
        const { id } = track;
        const { [id]: hash } = this.hashesById;
        const { tempFile, file } = this.descriptors[id];
        const { size } = await stat(file);
        await this.storage.put(hash, size);
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

    private hashToFile(h: Hash): FileName {
        const part0 = h.substr(0, 2);
        const part1 = h.substr(2, 2);
        return join(this.options.storageDirectory, part0, part1, h);
    }

    private getTrackPath(track: Track): FileName {
        const h = this.hashesById[track.id];
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

        const cachedItems = await this.getCachedItems();
        this.reportCachedItems(cachedItems);

        //todo: make concurrency better
        for (let i = 0; i < tracks.length; i += concurrency) {
            await Promise.all(
                tracks
                    .slice(i, i + concurrency)
                    .map(track => this.fetchTrack(track))
            );
        }
    }

    public async cleanup() {
        const {
            options: { maxSize }
        } = this;
        const garbageItems = await this.storage.getGarbageItems(maxSize);
        const deletedItems = [];
        for (let i = 0; i < garbageItems.length; i++) {
            try {
                const hash: Hash = garbageItems[i];
                await remove(`${this.hashToFile(hash)}.mp3`);
                deletedItems.push(hash);
            } catch (e) {
                console.error(e);
            }
        }
        this.storage.remove(deletedItems);
    }
}
