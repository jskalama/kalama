import { combineReducers } from 'redux';
import tracks from './ducks/tracks';
import router from './ducks/router';
import search from './ducks/search';
import download from './ducks/download';
import flashMessages from './ducks/flashMessages';

export default combineReducers({
    tracks,
    router,
    search,
    download,
    flashMessages
});
