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
        isPaused: state.tracks.isPaused
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
            props: { tracks, current, togglePause, isPlaying, isPaused },
            handleTrackSelect
        } = this;

        const toolbarActions = { togglePause };

        return (
            <element>
                <box height="100%-2">
                    <TracksList
                        tracks={tracks}
                        current={current}
                        onTrackSelect={handleTrackSelect}
                    />
                </box>
                <box top="100%-4">
                    <TrackInfo
                        track={tracks[current]}
                        isPlaying={isPlaying}
                        isPaused={isPaused}
                    />
                </box>

                <box top="100%-1">
                    <Toolbar actions={toolbarActions} />
                </box>
            </element>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerScreen);
