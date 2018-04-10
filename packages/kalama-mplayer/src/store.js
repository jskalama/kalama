import { createStore, applyMiddleware } from 'redux';
// import { createEffectCapableStore } from 'redux-side-effects';
import reducers from './reducers';
import sagas from './sagas';
import createSagaMiddleware from 'redux-saga';
import { die } from './services/sod';

// const storeFactory = createEffectCapableStore(createStore);
// const store = storeFactory(reducers);
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducers, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(sagas).done.catch(die);

export default store;
