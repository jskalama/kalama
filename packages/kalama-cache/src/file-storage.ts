import { Track } from 'kalama-api';
import md5 from 'md5';
import assert = require('assert');
import { join } from 'path';

type FileName = string;
type Hash = string;

class FileStorageTransaction {
    constructor(private readonly track: Track) {}
    public commit() {}
    public rollback() {}
}

export class FileStorage {
    constructor(private readonly dir: FileName) {}

    public get(track: Track) {}

    public createTransaction(track: Track): FileStorageTransaction {}

    private getTrackHash(track: Track): Hash {
        assert(track.id);
        // TODO: cache for better performance
        return md5(track.id);
    }
    private getTrackPath(track: Track): FileName {
        const h = this.getTrackHash(track);
        const part0 = h.substr(0, 2);
        const part1 = h.substr(2, 2);
        return join(this.dir, part0, part1, h);
    }
}
