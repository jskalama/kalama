import React, { Component } from 'react';
import { func, arrayOf, string, any, shape } from 'prop-types';
import Input from './Input';

export default class Autocomplete extends Component {
    static propTypes = {
        value: any,
        label: string,
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
            this.setState(({ selectedIndex }, { items }) => {
                const len = items.length;
                const newIndex = selectedIndex - 1;
                const newSelectedIndex = newIndex < 0 ? len - 1 : newIndex;
                return {
                    selectedIndex: newSelectedIndex
                };
            });
        }
        if (key.name === 'enter') {
            handleSelect();
        }
    };

    render() {
        const {
            state: { selectedIndex },
            props: { label, items, onInput },
            handleKey,
            style
        } = this;

        const strLabel = label ? label : '';
        const labelSpace = strLabel.length + 1;

        return (
            <element>
                <box height={1}>
                    <box width={labelSpace} height={1}>
                        {strLabel}
                    </box>
                    <Input
                        ref="input"
                        left={labelSpace}
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
