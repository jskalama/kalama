# kalama

Music search client written in Node.


### Installation:

```
npm -g install kalama
```

### Usage:

Search and play music:

```
kalama
```

_Note: it will run VLC player by default. How to use other player: see Configuration section_

Search and save tracks as MP3 files:

```
kalama get ~/Music/folder-to-download
```

Search and export tracks as M3U file (with URLs, so that most players can play it directly from the remote servers):

```
kalama playlist ~/Music/my-music.m3u
```

Search, download, create ZIP archive with tracks and share it in the local network with QR-code (which you can use to download the tracks from PC to mobile device):

```
kalama share
```


### Configuration

On Linux systems the configuration file is stored under `~/.config/configstore/kalama.json`.

By default it is the following:

```
{
	"player": "vlc %"
}
```

You can change `vlc` to any player that supports `m3u` playlists. For example, for **Audacious** it will be the following:

```
{
	"player": "audacious %"
}
```

**Note:** Don't forget to place `%` sign after the player command. It is a placeholder for playlist file.

### Demo:

https://youtu.be/GDD5nfu5QPs
