import React, { Component } from 'react';
import { func, arrayOf, string, any, shape } from 'prop-types';
import Input from './Input';

export default class Autocomplete extends Component {
    static propTypes = {
        value: any,
        onChange: func,
        onInput: func,
        items: arrayOf(
            shape({
                value: any,
                title: string
            })
        )
    };

    style = {
        list: {
            selected: {
                bg: 'blue'
            }
        }
    };

    state = {
        selectedIndex: 0
    };

    focus() {
        this.refs.input && this.refs.input.focus();
    }
    handleSelect = () => {
        const { state: { selectedIndex }, props: { items, onChange } } = this;
        const item = items[selectedIndex];
        item && onChange && onChange(item.value);
    };
    handleKey = (ch, key) => {
        const { handleSelect } = this;
        if (key.name === 'down') {
            this.setState(({ selectedIndex }, { items }) => ({
                selectedIndex: (selectedIndex + 1) % items.length
            }));
        }
        if (key.name === 'up') {
            this.setState(({ selectedIndex }, { items }) => ({
                selectedIndex: (selectedIndex - 1) % items.length
            }));
        }
        if (key.name === 'enter') {
            debugger;
            handleSelect();
        }
    };

    render() {
        const {
            state: { selectedIndex },
            props: { items, onInput },
            handleKey,
            style
        } = this;
        return (
            <element>
                <box height={1}>
                    <box width={8} height={1}>
                        Search:
                    </box>
                    <Input
                        ref="input"
                        left={8}
                        height={1}
                        onKey={handleKey}
                        onChange={onInput}
                    />
                </box>
                <box top={1} height="100%-1">
                    <list
                        ref="list"
                        interactive
                        mouse
                        selected={selectedIndex}
                        style={style.list}
                        items={items.map(i => i.title)}
                    />
                </box>
            </element>
        );
    }
}
