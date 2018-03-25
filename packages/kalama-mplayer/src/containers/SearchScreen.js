import React, { Component } from 'react';
import Autocomplete from '../components/Autocomplete';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { OnQueryChange, getQueryResult } from '../ducks/search';

const mapStateToProps = state => {
    return {
        suggestions: getQueryResult(state)
    };
};
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            OnQueryChange
        },
        dispatch
    );
};

class SearchScreen extends Component {
    componentDidMount() {
        this.refs.autocomplete && this.refs.autocomplete.focus();
    }

    render() {
        const { props: { OnQueryChange, suggestions } } = this;
        return (
            <element>
                <box height="100%">
                    <form
                        keys
                        border={{ type: 'line' }}
                        style={{ border: { fg: 'blue' } }}
                    >
                        <Autocomplete
                            onInput={OnQueryChange}
                            items={suggestions.map(s => ({
                                value: s,
                                title: s.label
                            }))}
                            ref="autocomplete"
                        />
                    </form>
                    search
                </box>
            </element>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
