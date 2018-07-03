import { Database, open } from 'sqlite';
import { join, dirname } from 'path';
import { makeTree } from 'q-io/fs';

export class ConnectionPool {
    private static dbByFile: { [file: string]: Database } = {};

    public static async getDatabase(dbFile: string): Promise<Database> {
        if (!this.dbByFile[dbFile]) {
            await makeTree(dirname(dbFile));
            const db = (this.dbByFile[dbFile] = await open(dbFile));
            await db.migrate({
                migrationsPath: join(__dirname, '..', 'migrations')
            });
        }
        const db = this.dbByFile[dbFile];
        return db;
    }
}
