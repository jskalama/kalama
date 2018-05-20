import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getRoute } from '../ducks/router';
import Label from '../components/Label';
import { getPlaylistResource } from '../ducks/search';
import { getTasksSummary, STATUS_SCHEDULED } from '../ducks/download';
import { getCurrentTrack } from '../ducks/tracks';

const mapStateToProps = state => {
    return {
        route: getRoute(state),
        playlist: getPlaylistResource(state),
        tasksSummary: getTasksSummary(state),
        currentTrack: getCurrentTrack(state)
    };
};
const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch);
};

const getTitle = (route, playlist, tasksSummary, currentTrack) => {
    const screenName = route ? route.screen : null;
    const playlistName = playlist ? playlist.label : null;
    let part0, part1, part2;
    if (screenName === 'Search') {
        part0 = 'kalama (press Ctrl+L to help)';
    } else {
        part0 = screenName;
    }
    const tasksLeft = tasksSummary[STATUS_SCHEDULED];
    if (tasksLeft > 0) {
        part1 = `Tasks: ${tasksLeft}`;
    } else {
        part1 = playlistName;
    }
    if (currentTrack) {
        part2 = currentTrack.title;
    }

    return [part0, part1, part2].filter(_ => _).join(' / ');
};

class MainWindow extends Component {
    boxStyle = { border: { fg: 'blue' } };
    borderOptions = { type: 'line' };
    titleStyle = { bg: 'blue' };
    render() {
        const {
            boxStyle,
            borderOptions,
            titleStyle,
            props: { children, route, playlist, tasksSummary, currentTrack }
        } = this;
        return (
            <element>
                <box
                    border={borderOptions}
                    style={boxStyle}
                    width="100%"
                    height="100%"
                >
                    {children}
                </box>
                <Label
                    style={titleStyle}
                    top={0}
                    text={getTitle(route, playlist, tasksSummary, currentTrack)}
                />
            </element>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainWindow);
