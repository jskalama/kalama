import 'babel-polyfill';
import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import { Provider } from 'react-redux';
import store from './store';
import Router from './containers/Router';
import { initKeyboard, getGlobalKeys } from './services/keyboard';
import { initSOD } from './services/sod';
import { platform } from 'os';

if (platform() === 'win32') {
    require('kalama-mplayer-binary-win32').setup();
}

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
    ignoreLocked: getGlobalKeys()
});

initKeyboard(screen, store);
initSOD(screen);

render(<App />, screen);
