import { parse as urlParse, format as urlFormat } from 'url';
import { expect } from 'chai';
import {
    ItemType,
    search,
    getArtistAlbumsList,
    getTracksList,
    Track
} from '../api';
import snapshot = require('snap-shot-it');

const removeTimestampsFromUrl = (url: string) => {
    const parsedUrl = urlParse(url);
    parsedUrl.search = null;
    parsedUrl.query = null;
    return urlFormat(parsedUrl);
};

const makeTrackDetermistic = (track: Track): Track => {
    return {
        ...track,
        url: removeTimestampsFromUrl(track.url)
    };
};

describe('search', () => {
    it('should return results', async () => {
        const { artists, albums, songs } = await search('asd');
        snapshot(artists.find(artist => artist.label === 'ASD'));
        snapshot(
            albums.find(album => album.label === 'A Skylit Drive - ASD (2015)')
        );
        snapshot(songs.find(song => song.label === 'Scann-Tec - ASD'));
    });
});

describe('getArtistAlbumsList', () => {
    it("should get a list of artist's albums", async () => {
        const albums = await getArtistAlbumsList({
            url: 'https://myzuka.me/Artist/142641/Asd'
        });
        snapshot(
            albums.find(album => album.label === 'Sag Mir Wo Die Party Ist!')
        );
    });
});

describe('getTracksList', () => {
    it("should get a list of artist's albums", async () => {
        const tracks = await getTracksList({
            itemType: ItemType.Album,
            label: '',
            url:
                'https://myzuka.me/Album/802734/Asd-Blockbasta-Deluxe-Edition-2015'
        });
        snapshot(
            makeTrackDetermistic(
                tracks.find(track => track.title === 'ASD - Die Partei')
            )
        );
    });
});
