import inquirer = require('inquirer');
import autocomplete = require('inquirer-autocomplete-prompt');
import { search, SearchResult, SearchResultItem, ItemType } from './api';

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

export const chooseFromSearchResults = async (
    searchResult: SearchResult
): Promise<SearchResultItem> => {
    return (await inquirer.prompt([searchResultToChoices(searchResult)]))
        .result;
};
