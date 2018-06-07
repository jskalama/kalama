import { join } from 'path';
import download from 'download';
import Аrchiver from 'archiver-promise';
import { resolve } from '../lib/config';

export const performDownloadTask = async task => {
    const downloadDir = await getDownloadDir();
    const targetDir = join(downloadDir, task.folderName);
    await download(task.url, targetDir, {
        filename: task.fileName
    });
};

export const getDownloadDir = async () => {
    const conf = await resolve();
    const downloadDir = conf['downloads-dir'];
    return downloadDir;
};

export const performArchiveTask = async task => {
    const t = task;
    debugger;
    //TODO: implement

    /*
example    
folderName:"Vienna - Asd"
id:"r96o3f7"
status:"STATUS_SCHEDULED"
type:"TYPE_ARCHIVE"
*/
};
