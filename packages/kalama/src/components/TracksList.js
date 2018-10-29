import React, { Component, PropTypes } from 'react';
import chalk from 'chalk';
import formatDuration from 'format-duration';
import { tracksList } from '../theme/colors';

const TrackShape = PropTypes.shape({
    title: PropTypes.string
});

export default class TracksList extends Component {
    static propTypes = {
        tracks: PropTypes.arrayOf(TrackShape),
        current: PropTypes.number,
        onTrackSelect: PropTypes.func
    };

    componentDidMount() {
        const {
            props: { onTrackSelect },
            refs: { list }
        } = this;
        list.on('select', (_, index) => {
            onTrackSelect(index - 1); //minus one is because this is a TableList which has headers
        });
        list.focus();
    }

    tracksListToListItems(tracks, current) {
        const headers = ['Track'];
        const body = tracks.map((it, i) => {
            const { prefix, suffix, duration } = it;
            const currentSign = i === current ? '>' : ' ';
            const fullTitle = `${prefix}${chalk.bold(suffix)}`;
            return [
                `${currentSign}${fullTitle}`,
                formatDuration(duration * 1000)
            ];
        });
        return [headers, ...body];
    }

    shouldComponentUpdate(nextProps) {
        const { props } = this;
        if (nextProps.tracks !== props.tracks) {
            return true;
        }
        if (nextProps.current !== props.current) {
            return true;
        }
        return false;
    }

    render() {
        const {
            props: { tracks, current },
            tracksListToListItems
        } = this;
        return (
            <element>
                <listtable
                    width="100%"
                    height="100%"
                    align="left"
                    ref="list"
                    interactive
                    keys
                    mouse
                    selected={current + 1}
                    style={tracksList.list}
                    rows={tracksListToListItems(tracks, current)}
                />
            </element>
        );
    }
}
