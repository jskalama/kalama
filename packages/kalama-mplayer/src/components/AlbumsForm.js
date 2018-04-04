import React, { Component } from 'react';
import { func, array } from 'prop-types';
import Autocomplete from './Autocomplete';
import { formatAlbum } from './formatters';

export default class AlbumsForm extends Component {
    propTypes: {
        onInput: func,
        onChange: func,
        items: array
    };

    componentDidMount() {
        this.refs.autocomplete && this.refs.autocomplete.focus();
    }

    render() {
        const { props: { onInput, onChange, items, value } } = this;

        return (
            <Autocomplete
                label="Select Album:"
                value={value}
                onInput={onInput}
                onChange={onChange}
                items={items.map(album => ({
                    value: album,
                    title: formatAlbum(album)
                }))}
                ref="autocomplete"
            />
        );
    }
}
