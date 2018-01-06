import keypress = require('keypress');

export class CancelError extends Error {}

export interface IClosable {
    ui: { close: () => void };
}

export function cancellable<T>(prompt: Promise<T> & IClosable): Promise<T> {
    keypress(process.stdin);
    return new Promise((resolve, reject) => {
        const cancel = () => {
            prompt.ui.close();
            reject(new CancelError());
        };

        const onKeyPress = (ch, key) => {
            if (key && key.name == 'escape') {
                process.removeListener('keypress', onKeyPress);
                cancel();
            }
        };

        process.stdin.on('keypress', onKeyPress);

        prompt.then(
            res => {
                process.removeListener('keypress', onKeyPress);
                resolve(res);
            },
            res => {
                process.removeListener('keypress', onKeyPress);
                reject(res);
            }
        );
    });
}
