import * as kalama from 'kalama-api';

export const search = async query => {
    const { artists, albums, songs } = await kalama.search(query);
    return [...artists, ...albums, ...songs];
};

export const getAlbums = async artist => {
    return await kalama.getArtistAlbumsList(artist);
};

export const getTracks = async resource => {
    return await kalama.getTracksList(resource);
};
