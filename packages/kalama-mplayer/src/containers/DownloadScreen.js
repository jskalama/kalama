import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTasksSummary, getDownloadDir } from '../ducks/download';
import DownloadTasksSummary from '../components/DownloadTasksSummary';
import chalk from 'chalk';

class DownloadScreen extends Component {
    render() {
        const {
            props: { tasksSummary, downloadDir }
        } = this;
        return (
            <box keys mouse scrollable allwaysScroll>
                Downloading to:{'\n'}
                {chalk.bold(downloadDir)}

                <box top={3}>
                    <DownloadTasksSummary data={tasksSummary} />
                </box>
            </box>
        );
    }
}

const mapStateToProps = state => {
    return {
        tasksSummary: getTasksSummary(state),
        downloadDir: getDownloadDir(state)
    };
};

export default connect(mapStateToProps)(DownloadScreen);
