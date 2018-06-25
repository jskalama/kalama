import { Track } from 'kalama-api';
import download from 'download';

type TracksList = Array<Track>;

interface PlaylistCacheOptions {
    storageDirectory: string;
    concurrency: number;
}

class PlaylistCache {
    private retryQueue = [];

    constructor(
        private readonly tracks: TracksList,
        private readonly options: PlaylistCacheOptions
    ) {}

    private async fetchTrack(track: Track) {
        // TODO: implement
    }

    public async fetch() {
        const {
            tracks,
            options: { concurrency }
        } = this;
        // TODO: emit events across the process
        await this.fetchTrack(tracks[0]);
        for (let i = 1; i < tracks.length; i += concurrency) {
            await Promise.all(
                tracks
                    .slice(i, i + concurrency)
                    .map(track => this.fetchTrack(track))
            );
        }
    }
}
