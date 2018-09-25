import MP from 'mixpanel';
import macaddress from 'macaddress';
import os from 'os';

const TOKEN = 'a81f1ef2b2e5d2fbbb2a6cc1a57d4d99';

const getMac = async () =>
    new Promise((ok, fail) =>
        macaddress.one((err, mac) => {
            if (err) {
                return fail(err);
            }
            ok(mac);
        })
    );

const getId = async () => getMac();

const initUser = async () => {
    const uid = await getId();
    const user = os.userInfo().username;
    const host = os.hostname();
    const name = `${user}@${host}`;
    mixpanel.people.set(uid, {
        $first_name: name
    });
};

initUser().catch(() => {
    //Who fucking cares
});

const mixpanel = MP.init(TOKEN);
export const mpTrack = ::mixpanel.track;
