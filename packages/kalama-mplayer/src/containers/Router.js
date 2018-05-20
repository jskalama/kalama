import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MainWindow from './MainWindow';
import PlayerScreen from './PlayerScreen';
import SearchScreen from './SearchScreen';
import HelpScreen from './HelpScreen';
import DownloadScreen from './DownloadScreen';
import { getRoute } from '../ducks/router';

const mapStateToProps = (state, props) => {
    return {
        route: getRoute(state)
    };
};
const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch);
};

class Router extends Component {
    render() {
        const {
            props: {
                route,
                route: { screen }
            }
        } = this;
        switch (screen) {
            case 'Player':
                return (
                    <MainWindow>
                        <PlayerScreen route={route} />
                    </MainWindow>
                );
            case 'Search':
                return (
                    <MainWindow>
                        <SearchScreen route={route} />
                    </MainWindow>
                );
            case 'Help':
                return (
                    <MainWindow>
                        <HelpScreen route={route} />
                    </MainWindow>
                );
            case 'Download':
                return (
                    <MainWindow>
                        <DownloadScreen route={route} />
                    </MainWindow>
                );
            default:
                return <element>404</element>;
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Router);
