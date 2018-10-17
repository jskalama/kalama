import React, { Component, PropTypes } from 'react';

const TrackShape = PropTypes.shape({
    title: PropTypes.string
});

export default class TrackInfo extends Component {
    static propTypes = {
        track: TrackShape,
        isPlaying: PropTypes.bool,
        isPaused: PropTypes.bool,
        currentTime: PropTypes.number,
        cacheProgress: PropTypes.shape({
            cached: PropTypes.number,
            total: PropTypes.number
        })
    };

    style = {
        bg: 'gray'
    };

    render() {
        const {
            props: {
                track,
                isPlaying,
                isPaused,
                currentTime,
                cacheProgress: { cached, total }
            },
            style
        } = this;
        return (
            <box style={style}>
                <box style={style} top="100%-3" height={1}>
                    {track ? track.title : '-'} {isPaused ? '(paused)' : null}
                    {isPlaying && !isPaused ? '(playing)' : null}
                </box>
                <box style={style} top="100%-2" height={1}>
                    Tracks cached: {cached}/{total}
                </box>
                <box style={style} top="100%-1">
                    <box top={0}>{currentTime}%</box>
                    <progressbar
                        top={0}
                        left={4}
                        height={1}
                        filled={currentTime}
                        style={{ bar: { bg: 'green' } }}
                    />
                </box>
            </box>
        );
    }
}
