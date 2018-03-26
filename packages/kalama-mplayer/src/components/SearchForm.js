import React, { Component } from 'react';
import { func, array } from 'prop-types';
import Autocomplete from './Autocomplete';

export default class SearchForm extends Component {
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
                label="Search:"
                onInput={onInput}
                onChange={onChange}
                items={items.map(s => ({
                    value: s,
                    title: s.label
                }))}
                ref="autocomplete"
            />
        );
    }
}
