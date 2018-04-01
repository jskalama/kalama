import React, { Component } from 'react';
import { func, array } from 'prop-types';
import Autocomplete from './Autocomplete';
import formatAlbum from './formatAlbum';

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
        const { props: { onInput, onChange, items } } = this;

        return (
            <Autocomplete
                label="Select Album:"
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