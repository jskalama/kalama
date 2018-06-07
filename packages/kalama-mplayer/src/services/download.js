import { join } from 'path';
import download from 'download';
import Аrchiver from 'archiver-promise';
import { resolve } from '../lib/config';

// export const APP_DOWNLOAD_FOLDER = resolve()['downloads-dir'];
// export const APP_TMP_FOLDER = resolve()['temp-dir'];

export const performDownloadTask = async task => {
    const conf = await resolve();
    const downloadDir = conf['downloads-dir'];
    const targetDir = join(downloadDir, task.folderName);
    await download(task.url, targetDir);
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
