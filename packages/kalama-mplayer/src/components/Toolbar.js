import React, { Component, PropTypes } from 'react';

const btnStyle = { bg: 'blue', fg: 'white' };

export default class Toolbar extends Component {
    static propTypes = {
        actions: PropTypes.object
    };

    commands = [
        {
            label: 'Prev',
            action: null
            // callback: () => {
            //     console.log('Prev');
            // }
        },
        {
            label: 'Next',
            action: null
            // callback: () => {
            //     console.log('Next');
            // }
        },
        {
            label: 'Play/Pause',
            action: 'togglePause'
        }
    ];
    commandToButton = (command, index, allCommands) => {
        const width = Math.round(100 / allCommands.length);
        const left = width * index;
        return (
            <button
                mouse
                onPress={this.props.actions[command.action]}
                style={btnStyle}
                width={`${width}%-1`}
                left={`${left}%`}
            >
                {command.label}
            </button>
        );
    };
    render() {
        const { commands, commandToButton } = this;
        return <element>{commands.map(commandToButton)}</element>;
    }
}
