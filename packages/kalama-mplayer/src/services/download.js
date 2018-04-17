import { join } from 'path';
import { getDownloadsFolder } from 'platform-folders';

const FOLDER = 'Kalama-Downloads';

const getFolder = () => {
    join(getDownloadsFolder(), FOLDER);
};
