import 'babel-polyfill';
import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import { Provider } from 'react-redux';
import store from './store';
import PlayerScreen from './containers/PlayerScreen';
import { initKeyboard } from './services/keyboard';

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

initKeyboard(screen, store);

render(<App />, screen);
