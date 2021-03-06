// import fetch from 'node-fetch';
import axios from 'axios';
import cheerio = require('cheerio');
import { equal } from 'assert';
import assert = require('assert');

const SERVER_ROOT = 'https://myzuka.club';

export enum ItemType {
    Artist,
    Album,
    Song,
    Unknown,
}

export enum AlbumCategory {
    StudioAlbum = 2,
    EP = 3,
    Single = 4,
    ArtistCollection = 11,
    Demo = 9,
    Live = 6,
    SoundTrack = 14,
    Mixtape = 8,
    DJMix = 10,
    Bootleg = 5,
    VariousCollection = 7,
    FanCollection = 13,
    Other = 1,
}

export interface Resource {
    url: string;
}

export interface Track extends Resource {
    id: string;
    url: string;
    title: string;
    duration?: number;
}

export interface Item extends Resource {
    id?: string;
    label: string;
    image?: string;
    type?: string;
}

export interface SearchResultItem extends Item {
    itemType: ItemType;
}

export interface Artist extends SearchResultItem {
    itemType: ItemType.Artist;
}

export interface Album extends SearchResultItem {
    albumCategory?: AlbumCategory;
    itemType: ItemType.Album;
    year?: number;
}

export interface Song extends SearchResultItem {
    itemType: ItemType.Song;
}

export interface SearchResult {
    artists: Array<Artist>;
    albums: Array<Album>;
    songs: Array<Song>;
}

const normalizeUrl = (url: string): string => {
    if (!url) {
        return url;
    }
    const _url = `${url}`.trim();
    //Not using startsWith here becasue of: https://github.com/facebook/react-native/issues/11370
    if (_url.match(/^(http|https):\/\//i)) {
        return _url;
    }

    return `${SERVER_ROOT}${_url}`;
};

const itemTypeMap = {
    artist: ItemType.Artist,
    album: ItemType.Album,
    song: ItemType.Song,
};

const decodeItemTypeFromUrl = (url: string): ItemType => {
    const parts = url.split('/');
    const itemTypeIdentStr = (parts[1] ?? '').toLowerCase();
    if (itemTypeMap.hasOwnProperty(itemTypeIdentStr)) {
        return itemTypeMap[itemTypeIdentStr];
    } else {
        return ItemType.Unknown;
    }
};

const decodeItem = (item: Item): SearchResultItem => {
    return {
        ...item,
        url: normalizeUrl(item.url),
        itemType: decodeItemTypeFromUrl(item.url),
    };
};

export const search = async (term: string | null): Promise<SearchResult> => {
    if (term === null) {
        return {
            artists: [],
            albums: [],
            songs: [],
        };
    }

    const res = await axios.get(
        `${SERVER_ROOT}/Search/Suggestions?term=${encodeURIComponent(term)}`,
        {
            headers: { referer: SERVER_ROOT },
        }
    );
    const items = res.data.map(decodeItem);
    return {
        artists: items.filter((item) => item.itemType === ItemType.Artist),
        albums: items.filter((item) => item.itemType === ItemType.Album),
        songs: items.filter((item) => item.itemType === ItemType.Song),
    };
};

export const getArtistAlbumsList = async (
    artist: Resource
): Promise<Array<Album>> => {
    const url = artist.url;
    const albumsUrl = `${url}/Albums`;
    const queryResult = await axios.get(albumsUrl, {
        headers: { referer: SERVER_ROOT },
    });
    const htmlText: string = await queryResult.data;
    return parseAlbumsListHtml(htmlText);
};

export interface IGetTracksListOptions {
    noResolveRedirects?: boolean;
}

export const getTracksList = async (
    resource: SearchResultItem,
    { noResolveRedirects = false }: IGetTracksListOptions = {}
): Promise<Array<Track>> => {
    const url = resource.url;
    const queryResult = await axios.get(url, {
        headers: { referer: SERVER_ROOT },
    });
    const htmlText: string = await queryResult.data;
    let tracks = parseTracksListHtml(htmlText);
    if (resource.itemType === ItemType.Song) {
        tracks = tracks.slice(0, 1);
    }
    if (noResolveRedirects) {
        return tracks;
    }
    return (await Promise.all(tracks.map(resolveRedirectedTrack))).filter(
        (track) => track !== null
    );
};

const parseDurationDOM = (durationBitrateDiv: any): number => {
    const mmss = durationBitrateDiv
        .text()
        .trim()
        .match(/^(\d\d):(\d\d)/);
    if (!mmss) {
        return null;
    }
    const [, m, s] = mmss;
    const seconds = parseInt(m, 10) * 60 + parseInt(s, 10);
    return seconds;
};

const parseYearDOM = (albumDiv: any): number => {
    const yearStr = albumDiv
        .find('.info > .tags > a[href^="/Albums/"]')
        .text()
        .trim();

    if (!yearStr || !yearStr.length || !yearStr.match(/^\d{4}$/)) {
        return null;
    }
    return parseInt(yearStr, 10);
};

const parseTrackId = (idAttr: string): string => {
    const matches = idAttr.match(/^play_(.+)$/);
    assert(matches && matches[1], 'wrong track id format');
    const [, id] = matches;
    return id;
};

const parseTracksListHtml = (htmlText: string): Array<Track> => {
    const $ = cheerio.load(htmlText);
    const nodes = $('[itemtype="http://schema.org/MusicRecording"]');
    return nodes
        .map((i, node) => {
            const playButton = $(node).find(
                '[data-url][data-position][data-title]'
            );
            const durationBitrateDiv = $(node).find('.options .data');
            const url = playButton.attr('data-url');
            if (!url) {
                return null;
            }
            return {
                id: parseTrackId(playButton.parent().attr('id')),
                url,
                title: playButton.attr('data-title'),
                duration: parseDurationDOM(durationBitrateDiv),
            };
        })
        .get()
        .filter((_) => _)
        .map(({ id, url, title, duration }) => ({
            id,
            url: normalizeUrl(url),
            title,
            duration,
        }));
};

const parseAlbumsListHtml = (htmlText: string): Array<Album> => {
    const $ = cheerio.load(htmlText);
    const albumNodes = $('#divAlbumsList>.item[data-type]');
    return albumNodes
        .map((i, node) => {
            const $node = $(node);
            const labelNode = $node.find('.info > .title > a');
            return {
                url: labelNode.attr('href'),
                label: labelNode.text(),
                year: parseYearDOM($node),
                albumCategory: parseInt($node.attr('data-type'), 10),
                image: $node.find('.vis > a > img').attr('src'),
            };
        })
        .get()
        .map((item) => ({
            ...item,
            url: normalizeUrl(item.url),
            image: normalizeUrl(item.image),
        }));
};

export const resolveRedirectedTrack = async (
    resource: Track
): Promise<Track> => {
    //Yes, it looks like shit. But Axios treats 302 as an error,
    //so in our case success and failure are turned upside down.
    try {
        await axios.head(resource.url, {
            maxRedirects: 0,
        });
        throw new Error('Resource should be redirected');
    } catch (error) {
        if (!error.response) {
            throw error;
        }
        if (error.response.status === 302) {
            return { ...resource, url: error.response.headers.location };
        } else if (error.response.status === 404) {
            return null;
        } else {
            throw error;
        }
    }
};
