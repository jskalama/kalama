import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TracksList from '../components/TracksList';
import TrackInfo from '../components/TrackInfo';
import Toolbar from '../components/Toolbar';
import { setCurrentTrackIndex, init, togglePause } from '../ducks/tracks';

const mapStateToProps = state => {
    return {
        tracks: state.tracks.tracks,
        current: state.tracks.current,
        isPlaying: state.tracks.isPlaying,
        isPaused: state.tracks.isPaused,
        currentTime: state.tracks.currentTime
    };
};
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            setCurrentTrackIndex,
            togglePause,
            init
        },
        dispatch
    );
};

class PlayerScreen extends Component {
    componentDidMount() {
        const { props: { init } } = this;
        init();
    }

    handleTrackSelect = index => {
        const { props: { setCurrentTrackIndex } } = this;
        setCurrentTrackIndex(index);
    };

    render() {
        const {
            props: {
                tracks,
                current,
                togglePause,
                isPlaying,
                isPaused,
                currentTime
            },
            handleTrackSelect
        } = this;

        const toolbarActions = { togglePause };

        return (
            <element>
                <box height="100%-2">
                    <TracksList
                        tracks={tracks}
                        isPlaying={isPlaying}
                        isPaused={isPaused}
                        current={current}
                        onTrackSelect={handleTrackSelect}
                    />
                </box>
                <box top="100%-4">
                    <TrackInfo
                        track={tracks[current]}
                        isPlaying={isPlaying}
                        isPaused={isPaused}
                        currentTime={currentTime}
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

export default connect(mapStateToProps, mapDispatchToProps)(PlayerScreen);
