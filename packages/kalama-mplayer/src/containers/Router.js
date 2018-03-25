import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PlayerScreen from './PlayerScreen';
import SearchScreen from './SearchScreen';
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
        const { props: { route, route: { screen } } } = this;
        switch (screen) {
            case 'Player':
                return <PlayerScreen route={route} />;
            case 'Search':
                return <SearchScreen route={route} />;
            default:
                return <element>404</element>;
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Router);
