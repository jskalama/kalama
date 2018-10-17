import _ from 'lodash';
import { AlbumCategory } from 'kalama-api';

const categoryOrder = [
    AlbumCategory.StudioAlbum,
    AlbumCategory.EP,
    AlbumCategory.Single,
    AlbumCategory.ArtistCollection,
    AlbumCategory.Demo,
    AlbumCategory.Live,
    AlbumCategory.Bootleg,
    AlbumCategory.SoundTrack,
    AlbumCategory.Mixtape,
    AlbumCategory.DJMix,
    AlbumCategory.VariousCollection,
    AlbumCategory.FanCollection,
    AlbumCategory.Other
];

const orderAlbums = albums => {
    const byCat = _(albums)
        .orderBy('year', 'desc')
        .groupBy('albumCategory')
        .value();
    const sortedAlbums = _(categoryOrder)
        .map(cat => byCat[cat])
        .flatten(false)
        .filter(_.identity)
        .value();
    return sortedAlbums;
};

export default orderAlbums;
