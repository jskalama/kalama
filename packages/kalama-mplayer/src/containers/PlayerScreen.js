import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TracksList from '../components/TracksList';
import TrackInfo from '../components/TrackInfo';
import Toolbar from '../components/Toolbar';
import {
    directTrackSelect,
    init,
    togglePause,
    stepBack,
    stepForward,
    goToPrevTrack,
    goToNextTrack,
    getCacheProgress,
    getPrefixizedRawTracks
} from '../ducks/tracks';

const mapStateToProps = state => {
    return {
        tracks: getPrefixizedRawTracks(state),
        current: state.tracks.current,
        isPlaying: state.tracks.isPlaying,
        isPaused: state.tracks.isPaused,
        currentTime: state.tracks.currentTime,
        cacheProgress: getCacheProgress(state)
    };
};
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            directTrackSelect,
            togglePause,
            stepBack,
            stepForward,
            goToNextTrack,
            goToPrevTrack,
            init
        },
        dispatch
    );
};

class PlayerScreen extends Component {
    componentDidMount() {
        const {
            props: { init }
        } = this;
        init();
    }

    handleTrackSelect = index => {
        const {
            props: { directTrackSelect }
        } = this;
        directTrackSelect(index);
    };

    render() {
        const {
            props: {
                tracks,
                current,
                togglePause,
                isPlaying,
                isPaused,
                currentTime,
                stepBack,
                stepForward,
                goToPrevTrack,
                goToNextTrack,
                cacheProgress
            },
            handleTrackSelect
        } = this;

        const toolbarActions = {
            togglePause,
            stepForward,
            stepBack,
            goToNextTrack,
            goToPrevTrack
        };

        return (
            <element>
                <box height="100%-5">
                    <TracksList
                        tracks={tracks}
                        isPlaying={isPlaying}
                        isPaused={isPaused}
                        current={current}
                        onTrackSelect={handleTrackSelect}
                    />
                </box>
                <box top="100%-3">
                    <TrackInfo
                        track={tracks[current]}
                        isPlaying={isPlaying}
                        isPaused={isPaused}
                        currentTime={currentTime}
                        cacheProgress={cacheProgress}
                    />
                </box>

                <box top="100%-1">
                    <Toolbar
                        actions={toolbarActions}
                        isPlaying={isPlaying}
                        isPaused={isPaused}
                    />
                </box>
            </element>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayerScreen);
