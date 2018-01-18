import { onPollerTick } from '../ducks/tracks';
let pollerInterval;
const TIME = 1000;

export const pollerStart = dispatch => {
    clearInterval(pollerInterval);
    pollerInterval = setInterval(() => {
        dispatch(onPollerTick());
    }, TIME);
};

export const pollerEnd = () => clearInterval(pollerInterval);
