import { createStore } from 'redux';
import { createEffectCapableStore } from 'redux-side-effects';
import reducers from './reducers';

const storeFactory = createEffectCapableStore(createStore);
const store = storeFactory(reducers);
export default store;
