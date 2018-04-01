import React, { Component } from 'react';
import SearchForm from '../components/SearchForm';
import AlbumsForm from '../components/AlbumsForm';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    OnSuggestionSelect,
    OnQueryChange,
    OnAlbumQueryChange,
    getQueryResult,
    isAlbumsStep,
    isSearchStep,
    getAlbums,
    getFilteredAlbums,
    OnAlbumSelect
} from '../ducks/search';

const mapStateToProps = state => {
    return {
        suggestions: getQueryResult(state),
        albums: getAlbums(state),
        filteredAlbums: getFilteredAlbums(state),
        isSearchStep: isSearchStep(state),
        isAlbumsStep: isAlbumsStep(state)
    };
};
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            OnQueryChange,
            OnSuggestionSelect,
            OnAlbumSelect,
            OnAlbumQueryChange
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
                OnAlbumSelect,
                OnAlbumQueryChange,
                suggestions,
                filteredAlbums,
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
                    {isAlbumsStep && (
                        <AlbumsForm
                            onInput={OnAlbumQueryChange}
                            onChange={OnAlbumSelect}
                            items={filteredAlbums}
                        />
                    )}
                </box>
            </element>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
