import React, { Component, PropTypes } from 'react';
import { trackInfo } from '../theme/colors';

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

    render() {
        const {
            props: {
                track,
                isPlaying,
                isPaused,
                currentTime,
                cacheProgress: { cached, total }
            }
        } = this;
        return (
            <box style={trackInfo.box}>
                <box style={trackInfo.box} top="100%-3" height={1}>
                    {track ? track.title : '-'} {isPaused ? '(paused)' : null}
                    {isPlaying && !isPaused ? '(playing)' : null}
                </box>
                <box style={trackInfo.box} top="100%-2" height={1}>
                    Tracks cached: {cached}/{total}
                </box>
                <box style={trackInfo.box} top="100%-1">
                    <box top={0}>{currentTime}%</box>
                    <progressbar
                        top={0}
                        left={4}
                        height={1}
                        filled={currentTime}
                        style={trackInfo.progressbar}
                    />
                </box>
            </box>
        );
    }
}
