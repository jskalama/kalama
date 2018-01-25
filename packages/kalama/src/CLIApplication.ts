import yargs = require('yargs');

const Commands = Symbol('Commands');

export function CLIApplication<T extends { new (...args: any[]): {} }>(
    target: T
) {
    return class extends target {
        constructor(...args: any[]) {
            super();
            this.run();
        }

        run() {
            target[Commands].forEach(({ cmd, description, method }) => {
                yargs.command(cmd, description, this[method].bind(this));
            });
            yargs.help().argv;
        }
    };
}

export const command = (cmd: string | Array<string>, description: string) => {
    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        if (!target[Commands]) {
            target[Commands] = [];
        }
        target[Commands].push({
            cmd,
            description,
            method: propertyKey
        });
    };
};
