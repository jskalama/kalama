import { all } from 'redux-saga/effects';

import player from './sagas/player';
import keyboard from './sagas/keyboard';

function* sagas() {
    yield all([player(), keyboard()]);
}

export default sagas;
