import { combineReducers } from 'redux-side-effects';
import { reducer as tracks } from './ducks/tracks';

export default combineReducers({ tracks });
