import { search, getArtistAlbumsList } from './api';

const main = () => {
    getArtistAlbumsList({
        url: 'https://myzuka.me/Artist/142/Muse'
    }).then((result)=>{
        console.log(result);
    })
    // search('muse').then((result)=>{
    //     console.log(result);
    // })
};

main();
