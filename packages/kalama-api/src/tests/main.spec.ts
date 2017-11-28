import { expect } from 'chai';
import { ItemType, search, getArtistAlbumsList, getTracksList } from '../api';

describe('search', () => {
    it('should return results', async () => {
        const { artists, albums, songs } = await search('asd');
        expect(artists[0].url).to.equal('https://myzuka.me/Artist/142641/Asd');
        expect(albums[0].url).to.equal(
            'https://myzuka.me/Album/653002/A-Skylit-Drive-Asd-2015'
        );
        expect(songs[0].url).to.equal(
            'https://myzuka.me/Song/2547849/Scann-Tec-Asd'
        );
    });
});

describe('getArtistAlbumsList', () => {
    it("should get a list of artist's albums", async () => {
        const albums = await getArtistAlbumsList({
            url: 'https://myzuka.me/Artist/142641/Asd'
        });
        expect(albums).to.eql([
            {
                url:
                    'https://myzuka.me/Album/291418/Viva-Hits-Vol-20-Cd-1-2003',
                label: 'Viva Hits, Vol.20 [CD 1]',
                albumCategory: 7,
                image: 'https://cs9.myzuka.me/img/68/3335691/16152697.jpg'
            },
            {
                url:
                    'https://myzuka.me/Album/291463/Viva-Hits-Vol-21-Cd-1-2003',
                label: 'Viva Hits, Vol.21 [CD 1]',
                albumCategory: 7,
                image: 'https://cs9.myzuka.me/img/68/3336337/16151894.jpg'
            },
            {
                url:
                    'https://myzuka.me/Album/802749/Asd-Sag-Mir-Wo-Die-Party-Ist-2003',
                label: 'Sag Mir Wo Die Party Ist!',
                albumCategory: 3,
                image: 'https://cs285.myzuka.me/img/68/12799231/33191121.jpg'
            },
            {
                url:
                    'https://myzuka.me/Album/802736/Asd-Wer-Hatte-Das-Gedacht-2003',
                label: 'Wer Hätte Das Gedacht?',
                albumCategory: 2,
                image: 'https://cs285.myzuka.me/img/68/12799166/33191058.jpg'
            },
            {
                url:
                    'https://myzuka.me/Album/802737/Asd-Hey-Du-Nimm-Dir-Zeit-Ep-2003',
                label: 'Hey Du (Nimm Dir Zeit) EP',
                albumCategory: 3,
                image: 'https://cs285.myzuka.me/img/68/12799221/33191110.jpg'
            },
            {
                url: 'https://myzuka.me/Album/639833/Asd-Asd-Comeback-2015',
                label: 'ASD Comeback',
                albumCategory: 8,
                image: 'https://cs0.myzuka.me/img/71/9890979/25867344.jpg'
            },
            {
                url:
                    'https://myzuka.me/Album/802734/Asd-Blockbasta-Deluxe-Edition-2015',
                label: 'Blockbasta (Deluxe Edition)',
                albumCategory: 2,
                image: 'https://cs285.myzuka.me/img/68/12799193/33191084.jpg'
            }
        ]);
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
        expect(tracks).to.eql([
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799196/33191090/1/0/0/7d9d73d0abb7b3cf74cb5030073aad40/01_asd_die_partei_myzuka.me.mp3',
                title: 'ASD - Die Partei'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799197/33191091/1/0/0/38674ac698e1975881bda66b13515ac3/02_asd_blockbasta_myzuka.me.mp3',
                title: 'ASD - Blockbasta'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799198/33191092/1/0/0/ce9cfc6e5235521adaf18c02f29a219e/03_asd_mittelfinga_hoch_myzuka.me.mp3',
                title: 'ASD - Mittelfinga Hoch'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799199/33191093/1/0/0/e7ae55be01462cb57b214d984b3a49f6/04_asd_deadline_feat_max_herre_myzuka.me.mp3',
                title: 'ASD - Deadline (Feat. Max Herre)'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799200/33191094/1/0/0/d54b2b38742ad29f9381dcc55bca556a/05_asd_bruda_myzuka.me.mp3',
                title: 'ASD - Bruda'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799201/33191095/1/0/0/c9ab6e06300d4417b9af4979b2944c3c/06_asd_ueberall_is_krieg_myzuka.me.mp3',
                title: 'ASD - Üeberall Is Krieg'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799203/33191096/1/0/0/d5127ac79f31213647fcc1e23b985856/07_asd_tortellini_augen_myzuka.me.mp3',
                title: 'ASD - Tortellini Augen'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799204/33191097/1/0/0/fe8dd41e222fe2f9e26fcbf472d65dac/08_asd_legendar_popular_myzuka.me.mp3',
                title: 'ASD - Legendär / Populär'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799205/33191098/1/0/0/48566aad7be0231ee5ef8cb8d2e1efb6/09_asd_ausrasta_myzuka.me.mp3',
                title: 'ASD - Ausrasta'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799206/33191099/1/0/0/8fdd3544fbe32b3e6f2aaf73b556bfde/10_asd_airhorn_myzuka.me.mp3',
                title: 'ASD - Airhorn'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799207/33191100/1/0/0/fe5960c3f1b991e4607631b693bc536a/11_asd_antihaltung_myzuka.me.mp3',
                title: 'ASD - Antihaltung'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799211/33191101/1/0/0/52396b72d762da32b04ba7636cd8a637/12_asd_mensch_gegen_maschine_myzuka.me.mp3',
                title: 'ASD - Mensch Gegen Maschine'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799212/33191102/1/0/0/049007b0fa99f5fa3f2f691054337d64/13_asd_non_myzuka.me.mp3',
                title: 'ASD - Non'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799213/33191103/1/0/0/9b1a530547c6a1ddd7b8158ac3c2290f/14_asd_grosses_finale_myzuka.me.mp3',
                title: 'ASD - Grosses Finale'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799214/33191104/1/0/0/b4d833521dde852f20303868171ed4ab/15_asd_ich_seh_was_feat_nena_myzuka.me.mp3',
                title: 'ASD - Ich Seh Was (Feat. Nena)'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799215/33191105/1/0/0/91a8a34b9ef9968d4e76d6bc802f0eab/16_asd_guck_dir_diese_jungs_an_myzuka.me.mp3',
                title: 'ASD - Guck Dir Diese Jungs An'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799216/33191106/1/0/0/891a14ba5125fdfb8bc59fdfdd3f56d5/17_asd_goldkuste_feat_megaloh_myzuka.me.mp3',
                title: 'ASD - Goldküste (Feat. Megaloh)'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799217/33191107/1/0/0/309a5fc1d70b13264446ddd5e819090a/18_asd_mittelfinga_hoch_rmx_feat_eko_fresh_ali_as_and_curse_myzuka.me.mp3',
                title:
                    'ASD - Mittelfinga Hoch (RMX) (Feat. Eko Fresh, Ali As & Curse)'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799218/33191108/1/0/0/ca239bc65472a02937116ab86e34bfd0/19_asd_rap_tag_team_myzuka.me.mp3',
                title: 'ASD - Rap Tag Team'
            },
            {
                url:
                    'http://cs285.myzuka.me/dl/68/12799219/33191109/1/0/0/f0380817517ae639a161fae7465137ad/20_asd_hase_myzuka.me.mp3',
                title: 'ASD - Hase'
            }
        ]);
    });
});
