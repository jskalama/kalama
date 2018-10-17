import MP from 'mixpanel';
import macaddress from 'macaddress';
import md5 from 'md5';
import Humanhash from 'humanhash';
import { version } from '../../package.json';

const humanhash = new Humanhash();

const TOKEN = 'a81f1ef2b2e5d2fbbb2a6cc1a57d4d99';

const getMac = async () =>
    new Promise((ok, fail) =>
        macaddress.one((err, mac) => {
            if (err) {
                return fail(err);
            }
            ok(md5(mac));
        })
    );

const getId = async () => getMac();

const initUser = async () => {
    const uid = await getId();
    const name = humanhash.humanize(uid);
    mixpanel.people.set(uid, {
        $first_name: name
    });
};

initUser().catch(() => {
    //Who fucking cares
});

const mixpanel = MP.init(TOKEN);
export const mpTrack = async (type, args = {}) => {
    const id = await getId();
    mixpanel.track(type, {
        distinct_id: id,
        version,
        ...args
    });
};
