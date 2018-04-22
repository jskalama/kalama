import React, { Component } from 'react';
import {
    STATUS_COMPLETED,
    STATUS_RUNNING,
    STATUS_FAILED,
    STATUS_SCHEDULED
} from '../ducks/download';

export default class DownloadTasksSummary extends Component {
    render() {
        const {
            props: { data }
        } = this;
        return (
            <element>
                Completed: {data[STATUS_COMPLETED]}
                {'\n'}
                Failed: {data[STATUS_FAILED]}
                {'\n'}
                Scheduled: {data[STATUS_SCHEDULED]}
                {'\n'}
                Running: {data[STATUS_RUNNING]}
                {'\n'}
            </element>
        );
    }
}
