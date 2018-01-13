import React, { Component, PropTypes } from 'react';

const TrackShape = PropTypes.shape({
    title: PropTypes.string
});

export default class TrackInfo extends Component {
    static propTypes = {
        track: TrackShape,
        isPlaying: PropTypes.bool,
        isPaused: PropTypes.bool
    };

    style = {
        bg: 'gray'
    };

    render() {
        const { props: { track, isPlaying, isPaused }, style } = this;
        return (
            <box style={style}>
                {track ? track.title : '-'} {isPaused ? '(paused)' : null}
                {isPlaying ? '(playing)' : null}
            </box>
        );
    }
}
