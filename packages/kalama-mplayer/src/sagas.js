import { all } from 'redux-saga/effects';

import player from './sagas/player';
import navigation from './sagas/navigation';
import keyboard from './sagas/keyboard';
import search from './sagas/search';

function* sagas() {
    yield all([player(), keyboard(), navigation(), search()]);
}

export default sagas;
