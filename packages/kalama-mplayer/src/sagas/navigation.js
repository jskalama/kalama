import { takeEvery, select, call, put, fork, cancel } from 'redux-saga/effects';
import { Navigate } from '../ducks/router';

function* navigationSaga() {
    yield put(Navigate('Search'));
}

export default navigationSaga;
