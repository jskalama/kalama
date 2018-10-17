import React, { Component } from 'react';
import chalk from 'chalk';

export default class HelpScreen extends Component {
    render() {
        return (
            <box keys mouse scrollable allwaysScroll>
                {chalk.bold('kalama')}
                {'\n'}
                {'\n'}
                - search what you want{'\n'}
                - select with arrow keys and enter{'\n'}
                - listen{'\n'}
                - use escape key to search again{'\n'}
                {'\n'}
                space - pause/play{'\n'}
                arrow left/right - +-10 seconds{'\n'}
                ctrl + arrow left/right - prev/next track{'\n'}
            </box>
        );
    }
}
