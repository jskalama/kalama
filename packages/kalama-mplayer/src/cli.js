#!/usr/bin/env node
import run from './app';

import yargs from 'yargs';
import conf, { resolve } from './lib/config';
import { underline, dim, bold } from 'chalk';
import repeat from 'repeat-string';

yargs
    .command(
        'conf-clear',
        'Set config to default values',
        () => {},
        () => {
            conf.clear();
            console.log('Config is set to default values');
        }
    )
    .command(
        'conf-set <key> <value>',
        'Set config value',
        () => {},
        ({ key, value }) => {
            conf.set(key, value);
            console.log(`${bold(key)} is set to ${bold(value)}`);
        }
    )
    .command(
        'conf-delete <key>',
        'Delete config value',
        () => {},
        ({ key }) => {
            conf.delete(key);
            console.log(`${bold(key)} is removed`);
        }
    )
    .command(
        'conf-list',
        'List config values',
        () => {},
        () => {
            const resolvedConf = resolve();
            Object.entries(conf.all).forEach(([k, v]) =>
                console.log(
                    `${underline(k)} = ${bold(v)}\n${repeat(
                        ' ',
                        k.length
                    )}   ${dim(resolvedConf[k])}`
                )
            );
        }
    )
    .command('*', 'Listen to music', () => {}, () => run())
    .help().argv;
