import { homedir, tmpdir, platform } from 'os';
import { delimiter, sep } from 'path';
import Configstore from 'configstore';
import { DEFAULT_VOLUME } from './volume';
import getUserFolders from 'user-folders';

const loadDependencies = async () => {
    try {
        const folders = await getUserFolders();
        const downloads = folders.download;
        return {
            downloads
        };
    } catch (e) {
        return {
            downloads: homedir()
        };
    }
};

let cache = false;

const conf = new Configstore('kalama', {
    'downloads-dir': '{OS_DOWNLOADS}{/}Kalama',
    'temp-dir': '{OS_TMP}',
    volume: DEFAULT_VOLUME,
    player: 'vlc %',
    cacheMaxSize: 200e6,
    forceHttp: platform() === 'darwin' ? 'yes' : 'no'
});

const resolveOne = (macros, v) =>
    Object.entries(macros).reduce(
        (v, [macro, replacement]) =>
            v && v.replace ? v.replace(macro, replacement) : v,
        v
    );

const resolve = async () => {
    if (cache) {
        return cache;
    }
    const { downloads } = await loadDependencies();
    const macros = {
        '{OS_DOWNLOADS}': downloads,
        '{OS_HOME}': homedir(),
        '{OS_TMP}': tmpdir(),
        '{/}': sep,
        '{COLON}': delimiter
    };

    const cache = Object.entries(conf.all)
        .map(([k, v]) => [k, resolveOne(macros, v)])
        .reduce((obj, [k, v]) => {
            obj[k] = v;
            return obj;
        }, {});
    return cache;
};

export { resolve };
export default conf;
