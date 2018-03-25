import React, { Component } from 'react';

export default class SearchScreen extends Component {
    componentDidMount() {
        this.refs.searchInput && this.refs.searchInput.focus();
    }
    render() {
        return (
            <element>
                <box height="100%">
                    <form
                        keys
                        border={{ type: 'line' }}
                        style={{ border: { fg: 'blue' } }}
                    >
                        <box width={8} height={1}>
                            Search:
                        </box>
                        <textbox
                            keys
                            mouse
                            left={8}
                            height={1}
                            inputOnFocus
                            ref="searchInput"
                        />
                    </form>
                    search
                </box>
            </element>
        );
    }
}
