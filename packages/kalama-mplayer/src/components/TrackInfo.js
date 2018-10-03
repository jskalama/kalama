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
                {track ? track.title : '-'} {isPaused ? '(paused)' : null}
                {isPlaying && !isPaused ? '(playing)' : null}
                <box style={style} top="100%-2">
                    Tracks cached: {cached}/{total}
                </box>
                <box style={style} top="100%-2">
                    <box top={1}>{currentTime}%</box>
                    <progressbar
                        top={1}
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
