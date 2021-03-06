import { all } from 'redux-saga/effects';

import player from './sagas/player';
import navigation from './sagas/navigation';
import keyboard from './sagas/keyboard';
import search from './sagas/search';
import download from './sagas/download';
import flashMessages from './sagas/flashMessages';
import cache from './sagas/cache';
import mixpanel from './sagas/mixpanel';

function* sagas() {
    yield all([
        player(),
        keyboard(),
        navigation(),
        search(),
        download(),
        flashMessages(),
        cache(),
        mixpanel()
    ]);
}

export default sagas;
