import React, { Component } from 'react';
import {
    STATUS_COMPLETED,
    STATUS_RUNNING,
    STATUS_FAILED,
    STATUS_SCHEDULED
} from '../ducks/download';
import chalk from 'chalk';

export default class DownloadTasksSummary extends Component {
    render() {
        const {
            props: { data }
        } = this;
        const completed = data[STATUS_COMPLETED];
        const failed = data[STATUS_FAILED];
        const running = data[STATUS_RUNNING];
        const scheduled = data[STATUS_SCHEDULED];

        return (
            <element>
                {scheduled && `Scheduled: ${scheduled}\n`}
                {running && `Running: ${running}\n`}
                {completed && chalk.green(`Completed: ${completed}\n`)}
                {failed && chalk.red(`Failed: ${failed}\n`)}
                {'\n\n'}
                You may close this page with {`${chalk.bold('Escape')}`} key.
                {'\n'}
                Your downloads will remain running.
            </element>
        );
    }
}
