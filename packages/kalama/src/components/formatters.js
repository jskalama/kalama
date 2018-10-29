import { AlbumCategory, ItemType } from 'kalama-api';
import chalk from 'chalk';

export const formatAlbum = album => {
    //album category is missing in search results, so we skip it
    const categoryName = album.albumCategory
        ? `[${AlbumCategory[album.albumCategory]}] `
        : `[${'Album'}]`;

    return `${categoryName}${album.year ? album.year : ''} ${chalk.bold(
        album.label
    )}`;
};

export const formatSearchItem = item => {
    if (item.itemType === ItemType.Album) {
        return formatAlbum(item);
    }
    return `[${ItemType[item.itemType]}] ${chalk.bold(item.label)}`;
};
