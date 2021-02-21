import { join } from 'path';
import download from 'download';
import { resolve } from '../lib/config';
import fs from 'q-io/fs';
import mkdirp from 'mkdirp';

const copyCachedTask = async (task, targetDir) => {
    await mkdirp(targetDir);
    await fs.copy(task.cacheFile, join(targetDir, task.fileName));
};

const downloadTask = async (task, targetDir) => {
    await download(task.url, targetDir, {
        filename: task.fileName,
    });
};

export const performDownloadTask = async (task) => {
    const downloadDir = await getDownloadDir();
    const targetDir = join(downloadDir, task.folderName);

    if (task.cacheFile) {
        try {
            await copyCachedTask(task, targetDir);
            return;
        } catch (e) {
            await downloadTask(task, targetDir);
            return;
        }
    } else {
        await downloadTask(task, targetDir);
    }
};

export const getDownloadDir = async () => {
    const conf = await resolve();
    const downloadDir = conf['downloads-dir'];
    return downloadDir;
};

export const performArchiveTask = async () => {
    //TODO: implement
};
