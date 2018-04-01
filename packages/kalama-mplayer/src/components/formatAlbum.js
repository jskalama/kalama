import { AlbumCategory } from 'kalama-api';
import chalk from 'chalk';

const formatAlbum = album =>
    `[${AlbumCategory[album.albumCategory]}] ${chalk.yellow(
        album.year || '....'
    )} ${album.label}`;

export default formatAlbum;
