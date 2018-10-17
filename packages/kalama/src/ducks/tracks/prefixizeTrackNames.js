import LCP from 'lcp';

const prefixizeTrackNames = tracks => {
    const titles = tracks.map(_ => _.title);
    const prefix = LCP.findLCP(titles);
    const len = prefix ? prefix.length : 0;
    return tracks.map(track => {
        if (!len) {
            return { ...track, prefix: '', suffix: track.title };
        } else {
            return { ...track, prefix, suffix: track.title.substr(len) };
        }
    });
};

export default prefixizeTrackNames;
