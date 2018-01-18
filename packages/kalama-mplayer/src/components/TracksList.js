import React, { Component, PropTypes } from 'react';
import figures from 'figures';

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
        const playIcon = figures('▶');
        return tracks.map((it, i) => {
            const { title } = it;
            return i === current ? `${playIcon}${title}` : ` ${title}`;
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
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
            <list
                ref="list"
                interactive
                keys
                mouse
                selected={current}
                style={style}
                items={tracksListToListItems(tracks, current)}
            />
        );
    }
}
