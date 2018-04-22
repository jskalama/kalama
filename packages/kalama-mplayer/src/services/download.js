import { join } from 'path';
import { getDownloadsFolder } from 'platform-folders';
import download from 'download';

export const APP_DOWNLOAD_FOLDER = join(getDownloadsFolder(), 'Kalama-Downloads');

export const performDownloadTask = async task => {
    await download(task.url, join(APP_DOWNLOAD_FOLDER, task.folderName));
};
