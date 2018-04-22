import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTasksSummary } from '../ducks/download';
import DownloadTasksSummary from '../components/DownloadTasksSummary';
import { APP_DOWNLOAD_FOLDER } from '../services/download';

class DownloadScreen extends Component {
    render() {
        const {
            props: { tasksSummary }
        } = this;
        return (
            <box keys mouse scrollable allwaysScroll>
                Downloading to:{'\n'}
                {APP_DOWNLOAD_FOLDER}
                {'\n'}
                <box top={2}>
                    <DownloadTasksSummary data={tasksSummary} />
                </box>
            </box>
        );
    }
}

const mapStateToProps = state => {
    return {
        tasksSummary: getTasksSummary(state)
    };
};

export default connect(mapStateToProps)(DownloadScreen);
