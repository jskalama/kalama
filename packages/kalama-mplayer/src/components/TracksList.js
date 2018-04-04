import React, { Component, PropTypes } from 'react';
import chalk from 'chalk';

const TrackShape = PropTypes.shape({
    title: PropTypes.string
});

export default class TracksList extends Component {
    static propTypes = {
        tracks: PropTypes.arrayOf(TrackShape),
        current: PropTypes.number,
        onTrackSelect: PropTypes.func
    };

    style = {
        selected: {
            bg: 'blue'
        }
    };

    componentDidMount() {
        const { props: { onTrackSelect }, refs: { list } } = this;
        list.on('select', (_, index) => {
            onTrackSelect(index);
        });
        list.focus();
    }

    tracksListToListItems(tracks, current) {
        return tracks.map((it, i) => {
            const { prefix, suffix } = it;
            const fullTitle = `${chalk.gray(prefix)}${chalk.bold(suffix)}`;
            return i === current ? `>${fullTitle}` : ` ${fullTitle}`;
        });
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
            style,
            props: { tracks, current },
            tracksListToListItems
        } = this;
        return (
            <element>
                <list
                    ref="list"
                    interactive
                    keys
                    mouse
                    selected={current}
                    style={style}
                    items={tracksListToListItems(tracks, current)}
                />
                ads
            </element>
        );
    }
}
