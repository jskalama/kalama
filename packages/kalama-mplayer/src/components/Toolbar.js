import React, { Component, PropTypes } from 'react';

const btnStyle = { bg: 'blue', fg: 'white' };

export default class Toolbar extends Component {
    static propTypes = {
        actions: PropTypes.object,
        isPlaying: PropTypes.bool,
        isPaused: PropTypes.bool
    };

    commands = [
        {
            label: ' Prev',
            action: null
            // callback: () => {
            //     console.log('Prev');
            // }
        },
        {
            label: ' Next',
            action: null
            // callback: () => {
            //     console.log('Next');
            // }
        },
        {
            visibleIf: props => !props.isPlaying,
            label: ' ▶',
            action: 'togglePause'
        },
        {
            visibleIf: props => props.isPlaying,
            label: ' ||',
            action: 'togglePause'
        }
    ];
    commandToButton = (command, index, allCommands) => {
        const width = Math.round(100 / allCommands.length);
        const left = width * index;
        return (
            <button
                key={index}
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
    getCommands = () => {
        const { props, commands, commandToButton } = this;
        return commands.filter(cmd => {
            if (!cmd.visibleIf) {
                return true;
            }
            return !!cmd.visibleIf(props);
        });
    };
    render() {
        const { commands, commandToButton, getCommands } = this;
        return <element>{getCommands(commands).map(commandToButton)}</element>;
    }
}
