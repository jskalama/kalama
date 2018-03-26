import React, { Component } from 'react';
import SearchForm from '../components/SearchForm';
import AlbumsForm from '../components/AlbumsForm';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    OnSuggestionSelect,
    OnQueryChange,
    getQueryResult,
    isAlbumsStep,
    isSearchStep,
    getAlbums
} from '../ducks/search';

const mapStateToProps = state => {
    return {
        suggestions: getQueryResult(state),
        albums: getAlbums(state),
        isSearchStep: isSearchStep(state),
        isAlbumsStep: isAlbumsStep(state)
    };
};
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            OnQueryChange,
            OnSuggestionSelect
        },
        dispatch
    );
};

class SearchScreen extends Component {
    render() {
        const {
            props: {
                OnQueryChange,
                OnSuggestionSelect,
                suggestions,
                albums,
                isSearchStep,
                isAlbumsStep
            }
        } = this;
        return (
            <element>
                <box height="100%">
                    {isSearchStep && (
                        <SearchForm
                            onInput={OnQueryChange}
                            onChange={OnSuggestionSelect}
                            items={suggestions}
                        />
                    )}
                    {isAlbumsStep && <AlbumsForm items={albums} />}
                </box>
            </element>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
