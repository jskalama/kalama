import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import { Provider } from 'react-redux';
import store from './store';
import PlayerScreen from './containers/PlayerScreen';
import { appSetScreen } from './side-effects/app';

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <PlayerScreen />
            </Provider>
        );
    }
}

const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    title: 'kalama player'
});

appSetScreen(screen);


render(<App />, screen);
