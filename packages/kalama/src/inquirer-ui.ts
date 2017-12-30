import _ = require('lodash');
import inquirer = require('inquirer');
import autocomplete = require('inquirer-autocomplete-prompt');
import chalk from 'chalk';

import {
    search,
    SearchResult,
    SearchResultItem,
    ItemType,
    Album,
    AlbumCategory
} from 'kalama-api';

inquirer.registerPrompt('autocomplete', autocomplete);

export const askSearchTerm = async (): Promise<SearchResultItem> => {
    return (await inquirer.prompt([
        {
            message: 'Search',
            type: 'autocomplete',
            name: 'result',
            source: async function(answersSoFar, input) {
                const searchResult = await search(input);
                return searchResultToChoices(searchResult).choices;
            }
        }
    ])).result;
};

const searchResultToChoices = (searchResult: SearchResult) => {
    const artistsChoices = searchResult.artists.map(item => ({
        name: `[${ItemType[item.itemType]}] ${item.label}`,
        value: item
    }));
    const albumsChoices = searchResult.albums.map(item => ({
        name: `[${ItemType[item.itemType]}] ${item.label}`,
        value: item
    }));
    const songsChoices = searchResult.songs.map(item => ({
        name: `[${ItemType[item.itemType]}] ${item.label}`,
        value: item
    }));
    return {
        message: 'Select the stuff',
        type: 'list',
        name: 'result',
        choices: [...artistsChoices, ...albumsChoices, ...songsChoices]
    };
};

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

const sortAlbumsByCategory = (albums: Array<Album>): Array<Album> => {
    const byCat = _(albums)
        .orderBy('year', 'desc')
        .groupBy('albumCategory')
        .value();
    const sortedAlbums = <Array<Album>>_(categoryOrder)
        .map(cat => byCat[cat])
        .flatten(false)
        .filter(_.identity)
        .value();
    return sortedAlbums;
};

const albumsToChoices = (albums: Array<Album>) => {
    const albumsChoices = sortAlbumsByCategory(albums).map(item => ({
        name: `[${AlbumCategory[item.albumCategory]}] ${chalk.yellow(
            item.year || '....'
        )} ${item.label}`,
        value: item
    }));

    return {
        message: 'Select album',
        type: 'list',
        name: 'result',
        choices: albumsChoices
    };
};

export const chooseFromSearchResults = async (
    searchResult: SearchResult
): Promise<SearchResultItem> => {
    return (await inquirer.prompt([searchResultToChoices(searchResult)]))
        .result;
};

export const chooseFromAlbums = async (
    albums: Array<Album>
): Promise<SearchResultItem> => {
    return (await inquirer.prompt([albumsToChoices(albums)])).result;
};
