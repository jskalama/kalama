import { createStore, applyMiddleware } from 'redux';
// import { createEffectCapableStore } from 'redux-side-effects';
import reducers from './reducers';
import sagas from './sagas';
import createSagaMiddleware from 'redux-saga';

// const storeFactory = createEffectCapableStore(createStore);
// const store = storeFactory(reducers);
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducers, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(sagas);

export default store;
