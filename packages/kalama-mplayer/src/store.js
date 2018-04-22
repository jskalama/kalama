import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import sagas from './sagas';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'remote-redux-devtools';
import { die } from './services/sod';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = composeWithDevTools({
    hostname: 'localhost',
    port: 8000,
    name: 'kalama'
});

const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(sagas).done.catch(die);

export default store;
