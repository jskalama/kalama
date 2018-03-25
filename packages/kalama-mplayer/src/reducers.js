import { combineReducers } from 'redux';
import tracks from './ducks/tracks';
import router from './ducks/router';

export default combineReducers({ tracks, router });
