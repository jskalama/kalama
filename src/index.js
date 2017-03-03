import fetch from "node-fetch";
import inquirer from "inquirer";
import cheerio from "cheerio";
import fs from "q-io/fs";
import os from "os";
import path from "path";
import { exec } from "child-process-promise";

const SERVER_ROOT = "https://myzuka.fm";
const PLAYER = "vlc";

const search = async term => {
    const res = await fetch(`${SERVER_ROOT}/Search/Suggestions?term=${encodeURIComponent(term)}`, {
        headers: { referer: SERVER_ROOT }
    });
    const items = await res.json();
    return items.map(decodeItem);
};

const askSearchTerm = async () => {
    return (await inquirer.prompt([ { message: "Search", type: "input", name: "search" } ])).search;
};

const chooseStuff = async suggestions => {
    return (await inquirer.prompt([
        {
            message: "Select the stuff",
            type: "list",
            name: "stuff",
            choices: suggestions.map(item => ({ name: `[${item.type}] ${item.value}`, value: item }))
        }
    ])).stuff;
};

const decodeItem = item => {
    const parts = item.url.split("/");
    const type = parts[1];
    return { ...item, type };
};

const loadPage = async url => {
    const res = await fetch(`${SERVER_ROOT}${url}`);
    return await res.text();
};

const htmlToSongs = html => {
    const $ = cheerio.load(html);
    const nodes = $(".play [data-url]");
    return nodes
        .map((i, node) => ({ url: $(node).attr("data-url"), title: $(node).attr("data-title") }))
        .get()
        .map(({ url, title }) => ({ url: `${SERVER_ROOT}${url}`, title }));
};

const playSongsList = async songs => {
    const fname = path.join(os.tmpdir(), Math.floor(Math.random() * 1e6).toString(36) + ".m3u");
    await fs.write(fname, "#EXTM3U\n" + songs.map(({ url, title }) => `#EXTINF:0,${title}\n${url}`).join("\n"));
    await exec(`${PLAYER} ${fname}`);
};

const getLogo = () => {
    return `
 \\ | /
_______
-_____-
`;
}

const displayLogo = () => console.log(getLogo());

const main = async () => {
    displayLogo();
    const term = await askSearchTerm();
    const suggestions = await search(term);
    const item = await chooseStuff(suggestions);
    const html = await loadPage(item.url);
    const songs = htmlToSongs(html);
    await playSongsList(songs);
};

main();
