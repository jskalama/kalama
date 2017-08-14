# kalama

Music search client written in Node.

VLC player has to be installed on your machine.

### Installation:

```
npm -g install kalama
```

### Usage:

Search and play music:

```
kalama
```

Search and download music as MP3 files:

```
kalama get ~/Music/folder-to-download
```

Search export tracks as M3U file (with URLs, so that most players can play it directly from the remote servers):

```
kalama playlist ~/Music/my-music.m3u
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
