import { all } from 'redux-saga/effects';

import player from './sagas/player';
import navigation from './sagas/navigation';
import keyboard from './sagas/keyboard';

function* sagas() {
    yield all([player(), keyboard(), navigation()]);
}

export default sagas;
