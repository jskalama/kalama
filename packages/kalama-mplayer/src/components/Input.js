import React, { Component } from 'react';

const makeListener = (input, onChange, onKey) => {
    const originalListener = input._listener;
    return function enchancedListener(ch, key) {
        if (key.name === 'escape') {
            return;
        }
        const prevValue = input.value;
        originalListener.call(input, ch, key);
        const value = input.value;
        onKey && onKey(ch, key);
        if (value !== prevValue) {
            onChange && onChange(value);
        }
    };
};

export default class Input extends Component {
    componentDidMount() {
        const { refs: { input }, props: { onChange, onKey } } = this;
        input._listener = makeListener(input, onChange, onKey);
    }

    focus() {
        this.refs.input && this.refs.input.focus();
    }

    render() {
        const { props } = this;
        return <textbox mouse inputOnFocus {...props} ref="input" />;
    }
}
