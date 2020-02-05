#!/usr/bin/env node
const axios = require('axios');
const inquirer = require('inquirer');
const chalk = require('chalk');

const getCredentials = () => {
    try {
        return require('../circle-credentials');
    } catch (e) {
        console.log(
            chalk`
Releasing from master requires CircleCI token.
1. Get the token
2. Copy {green ${'circle-credentials.js.sample'}} to {green ${'circle-credentials.js'}}
3. Paste the token into {green ${'circle-credentials.js'}}
`
        );
        process.exit(1);
    }
};

const checkLastMasterBuild = async () => {
    const { CI_TOKEN, CI_VCS, CI_ORG, CI_PROJECT } = getCredentials();
    const url = `https://circleci.com/api/v1.1/project/${CI_VCS}/${CI_ORG}/${CI_PROJECT}/tree/master?circle-token=${CI_TOKEN}&limit=1&offset=0`;
    const { data: [lastBuild] = [] } = await axios.get(url);
    let status = lastBuild.outcome;

    if (!lastBuild) {
        return;
    }
    if (lastBuild.outcome === 'success') {
        return;
    }
    if (lastBuild.outcome === null) {
        status = lastBuild.lifecycle;
        if (status === 'not_run') {
            return;
        }
    }

    console.log(
        chalk`
You cannot release until the latest build is successful.
Current status is {bgRed ${status}}
Please, check this build: {green ${lastBuild.build_url}}`
    );
    process.exit(1);
};

const main = async () => {
    const { CI_TOKEN, CI_VCS, CI_ORG, CI_PROJECT } = getCredentials();

    await checkLastMasterBuild();

    const { confirm } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Are you sure to release all changesets from master?',
            default: false
        }
    ]);
    if (!confirm) {
        console.log('Cancelled');
        return;
    }

    const url = `https://circleci.com/api/v1.1/project/${CI_VCS}/${CI_ORG}/${CI_PROJECT}/tree/master?circle-token=${CI_TOKEN}`;
    const {
        data: { build_url: buildUrl }
    } = await axios.post(url, {
        build_parameters: {
            CIRCLE_JOB: 'release'
        }
    });

    console.log(`Build has started at: ${buildUrl}`);
};

main().catch(e => {
    console.error(e.stack);
    process.exit(1);
});
