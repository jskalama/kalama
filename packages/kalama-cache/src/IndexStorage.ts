import { join } from 'path';
import { Database, open } from 'sqlite';
import { Hash } from './kalama-cache';
import { constant, times } from 'lodash';
import { makeTree } from 'q-io/fs';
import { ConnectionPool } from './ConnectionPool';

interface DbCacheItem {
    hash: Hash;
    accessTime: number;
    size: number;
}

export class IndexStorage {
    constructor(private cacheDir) {}

    private _db: Database;

    private async db(): Promise<Database> {
        return ConnectionPool.getDatabase(join(this.cacheDir, 'index.sqlite3'));
    }

    public async put(hash: string, size: number): Promise<void> {
        const db = await this.db();

        await db.run(
            'REPLACE INTO items (hash, size, accessTime) VALUES (?, ?, ?)',
            hash,
            size,
            Date.now()
        );
    }

    public async getGarbageItems(maxSize: number): Promise<Array<Hash>> {
        const db = await this.db();
        const { avgSize, sumSize } = await db.get(
            'SELECT AVG(size) AS avgSize, SUM(size) AS sumSize FROM items'
        );
        const reserveFactor = 1.5;
        const garbageSize = sumSize - maxSize;
        if (garbageSize <= 0) {
            return [];
        }
        const approxGarbageItemsCount = Math.round(
            (reserveFactor * garbageSize) / avgSize
        );

        console.log('sumSize', sumSize);
        console.log('avgSize', avgSize);
        console.log('approxGarbageItemsCount', approxGarbageItemsCount);
        const garbageItems = await db.all(
            'SELECT hash, size FROM items ORDER BY accessTime DESC LIMIT ?',
            approxGarbageItemsCount
        );

        const exactGarbageItems = [];
        for (
            let i = 0, sum = 0;
            i < garbageItems.length && sum <= garbageSize;
            i++
        ) {
            exactGarbageItems.push(garbageItems[i].hash);
            sum += garbageItems[i].size;
        }
        return exactGarbageItems;
    }

    public async remove(hashes: Array<Hash>): Promise<void> {
        const db = await this.db();
        const questionMarks = times(hashes.length, constant('?')).join(', ');
        await db.run(
            `DELETE FROM items WHERE hash IN(${questionMarks})`,
            ...hashes
        );
    }
}
