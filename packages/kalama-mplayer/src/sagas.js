import { all } from 'redux-saga/effects';

import player from './sagas/player';

function* sagas() {
    yield all([player()]);
}

export default sagas;
