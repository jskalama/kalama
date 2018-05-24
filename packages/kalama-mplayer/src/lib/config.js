import { platform, homedir, tmpdir } from 'os';
import { delimiter, sep } from 'path';
import Configstore from 'configstore';

const downloadsFolder =
    platform() === 'win32'
        ? homedir()
        : require('platform-folders').getDownloadsFolder();

const macros = {
    '{OS_DOWNLOADS}': downloadsFolder,
    '{OS_HOME}': homedir(),
    '{OS_TMP}': tmpdir(),
    '{/}': sep,
    '{COLON}': delimiter
};

const conf = new Configstore('kalama', {
    'downloads-dir': '{OS_DOWNLOADS}{/}Kalama',
    'temp-dir': '{OS_TMP}',
    player: 'vlc %'
});

const resolveOne = v =>
    Object.entries(macros).reduce(
        (v, [macro, replacement]) => v.replace(macro, replacement),
        v
    );

const resolve = () =>
    Object.entries(conf.all)
        .map(([k, v]) => [k, resolveOne(v)])
        .reduce((obj, [k, v]) => {
            obj[k] = v;
            return obj;
        }, {});

export { resolve };
export default conf;
