import { join } from 'path';
import download from 'download';
import Аrchiver from 'archiver-promise';

import { platform, homedir } from 'os';

const getDownloadsFolder =
    platform() === 'win32'
        ? homedir
        : require('platform-folders').getDownloadsFolder;

export const APP_DOWNLOAD_FOLDER = join(
    getDownloadsFolder(),
    'Kalama-Downloads'
);

export const performDownloadTask = async task => {
    await download(task.url, join(APP_DOWNLOAD_FOLDER, task.folderName));
};

export const performArchiveTask = async task => {
    //TODO: implement
};
