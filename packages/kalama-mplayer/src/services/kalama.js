import * as kalama from 'kalama-api';

export const search = async query => {
    const { artists, albums, songs } = await kalama.search(query);
    return [...artists, ...albums, ...songs];
};
