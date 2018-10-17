import sanitize from 'sanitize-filename';

const EXTENSION = '.mp3';

export const getFileNames = tracks => {
    const usedLabels = new Set();
    return tracks.map((track, i) => {
        const initialLabel = track.title.length ? track.title : 'Untitled';
        let label = initialLabel;
        while (usedLabels.has(label)) {
            label = `${initialLabel}${(i++).toString()}`;
        }
        usedLabels.add(label);
        return sanitize(`${label}${EXTENSION}`);
    });
};
