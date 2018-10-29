import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getRoute } from '../ducks/router';
import Label from '../components/Label';
import {
    getTasksSummary,
    STATUS_SCHEDULED,
    STATUS_FAILED,
    STATUS_COMPLETED
} from '../ducks/download';
import { getCurrentTrack, getParentResource } from '../ducks/tracks';
import { getMessage } from '../ducks/flashMessages';
import chalk from 'chalk';
import { mainWindow } from '../theme/colors';

const mapStateToProps = state => {
    return {
        route: getRoute(state),
        parentResource: getParentResource(state),
        tasksSummary: getTasksSummary(state),
        currentTrack: getCurrentTrack(state),
        message: getMessage(state)
    };
};
const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch);
};

const getTitle = (route, playlist, tasksSummary, currentTrack, message) => {
    if (message) {
        return message;
    }
    const screenName = route ? route.screen : null;
    const playlistName = playlist ? playlist.label : null;
    let part0, part1, part2;
    if (screenName === 'Search') {
        part0 = 'kalama (press Ctrl+L to help)';
    } else {
        part0 = screenName;
    }
    const tasksLeft = tasksSummary[STATUS_SCHEDULED];
    const tasksFailed = tasksSummary[STATUS_FAILED];
    const tasksCompleted = tasksSummary[STATUS_COMPLETED];
    if (tasksLeft > 0) {
        part1 = `Download: ${tasksLeft} (${chalk.green(
            tasksCompleted || 0
        )}|${chalk.red(tasksFailed || 0)})`;
    } else {
        part1 = playlistName;
    }
    if (currentTrack) {
        part2 = currentTrack.suffix;
    }

    return [part0, part1, part2].filter(_ => _).join(' / ');
};

class MainWindow extends Component {
    borderOptions = { type: 'line' };
    render() {
        const {
            boxStyle,
            borderOptions,
            props: {
                children,
                route,
                parentResource,
                tasksSummary,
                currentTrack,
                message
            }
        } = this;
        return (
            <element>
                <box
                    border={borderOptions}
                    style={mainWindow.box}
                    width="100%"
                    height="100%"
                >
                    {children}
                </box>
                <Label
                    style={mainWindow.title}
                    top={0}
                    text={getTitle(
                        route,
                        parentResource,
                        tasksSummary,
                        currentTrack,
                        message
                    )}
                />
            </element>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainWindow);
