import React, { Component, PropTypes } from 'react';

const TrackShape = PropTypes.shape({
    title: PropTypes.string
});

export default class TrackInfo extends Component {
    static propTypes = {
        track: TrackShape,
        isPlaying: PropTypes.bool,
        isPaused: PropTypes.bool,
        currentTime: PropTypes.number
    };

    style = {
        bg: 'gray'
    };

    render() {
        const {
            props: { track, isPlaying, isPaused, currentTime },
            style
        } = this;
        return (
            <box style={style}>
                {track ? track.title : '-'} {isPaused ? '(paused)' : null}
                {isPlaying ? '(playing)' : null}
                <box style={style} top="100%-3">
                    <box top={1}>{currentTime}%</box>
                    <progressbar
                        top={1}
                        left={4}
                        height={1}
                        filled={currentTime}
                        style={{ fg: 'red', bar: { fg: 'red', bg: 'green' } }}
                    />
                </box>
            </box>
        );
    }
}
