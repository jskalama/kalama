import React, { Component, PropTypes } from 'react';

const btnStyle = { bg: 'blue', fg: 'white', hover: { bg: 'yellow' } };

export default class Toolbar extends Component {
    static propTypes = {
        actions: PropTypes.object,
        isPlaying: PropTypes.bool,
        isPaused: PropTypes.bool
    };

    commands = [
        {
            visibleIf: props => props.isPaused && !props.isPlaying,
            label: ' |> [space]',
            action: 'togglePause'
        },
        {
            visibleIf: props => props.isPlaying,
            label: ' || [space]',
            action: 'togglePause'
        },
        {
            label: ' Prev [C <-]',
            action: 'goToPrevTrack',
            visibleIf: props => props.isPlaying || props.isPaused
        },
        {
            label: ' Next [C ->]',
            action: 'goToNextTrack',
            visibleIf: props => props.isPlaying || props.isPaused
        },
        {
            label: ' -10s [<-]',
            action: 'stepBack',
            visibleIf: props => props.isPlaying || props.isPaused
        },
        {
            label: ' +10s [->]',
            action: 'stepForward',
            visibleIf: props => props.isPlaying || props.isPaused
        }
    ];
    commandToButton = (command, index, allCommands) => {
        // const width = Math.round(100 / allCommands.length);
        const width = 13;
        const left = width * index;
        return (
            <button
                key={index}
                mouse
                onPress={() => {
                    command.action && this.props.actions[command.action]();
                }}
                style={btnStyle}
                width={width - 1}
                left={left}
            >
                {command.label}
            </button>
        );
    };
    getCommands = () => {
        const { props, commands } = this;
        return commands.filter(cmd => {
            if (!cmd.visibleIf) {
                return true;
            }
            return !!cmd.visibleIf(props);
        });
    };
    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.isPlaying !== this.props.isPlaying ||
            nextProps.isPaused !== this.props.isPaused
        );
    }
    render() {
        const { commands, commandToButton, getCommands } = this;
        return <element>{getCommands(commands).map(commandToButton)}</element>;
    }
}
