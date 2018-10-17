import React, { Component } from 'react';

export default class Label extends Component {
    render() {
        const {
            props: { text, ...props }
        } = this;
        const width = text.length;
        return (
            <box height={1} width={width} {...props}>
                {text}
            </box>
        );
    }
}
