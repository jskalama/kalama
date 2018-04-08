import 'babel-polyfill';
import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import { Provider } from 'react-redux';
import store from './store';
import Router from './containers/Router';
import { initKeyboard } from './services/keyboard';

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router />
            </Provider>
        );
    }
}

const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    title: 'kalama player',
    ignoreLocked: ['C-c', 'C-s', 'C-l', 'escape'] //TODO: move all global keybindings to one place
});

initKeyboard(screen, store);

render(<App />, screen);
