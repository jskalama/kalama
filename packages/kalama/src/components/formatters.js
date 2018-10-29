import { AlbumCategory, ItemType } from 'kalama-api';
import chalk from 'chalk';
import { highlight } from '../theme/colors';

const h = chalk.keyword(highlight);

export const formatAlbum = album => {
    //album category is missing in search results, so we skip it
    const categoryName = album.albumCategory
        ? `[${h(AlbumCategory[album.albumCategory])}] `
        : `[${h('Album')}]`;

    return `${categoryName}${album.year ? h(album.year) : ''} ${chalk.bold(
        album.label
    )}`;
};

export const formatSearchItem = item => {
    if (item.itemType === ItemType.Album) {
        return formatAlbum(item);
    }
    return `[${h(ItemType[item.itemType])}] ${chalk.bold(item.label)}`;
};
