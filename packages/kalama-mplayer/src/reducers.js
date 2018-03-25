import { combineReducers } from 'redux';
import tracks from './ducks/tracks';
import router from './ducks/router';
import search from './ducks/search';

export default combineReducers({ tracks, router, search });
