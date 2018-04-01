import { AlbumCategory, ItemType } from 'kalama-api';
import chalk from 'chalk';

const highlight = ::chalk.yellow;

export const formatAlbum = album => {
    //album category is missing in search results, so we skip it
    const categoryName = album.albumCategory
        ? `[${highlight(AlbumCategory[album.albumCategory])}] `
        : `[${highlight('Album')}]`;

    return `${categoryName}${album.year ? highlight(album.year) : ''} ${
        album.label
    }`;
};

export const formatSearchItem = item => {
    if (item.itemType === ItemType.Album) {
        return formatAlbum(item);
    }
    return `[${highlight(ItemType[item.itemType])}] ${item.label}`;
};
