import promiseRetry from 'promise-retry';

const isBusyError = error =>
    `${error}`.includes('Busy - cannot execute operation');

export const retryIfBusy = promiseCreator =>
    promiseRetry((retry, number) =>
        promiseCreator().catch(error => {
            console.log(`retry #${number}`, error);
            if (isBusyError(error)) {
                return retry();
            } else {
                throw error;
            }
        })
    );

export const ignoreIfBusy = promiseCreator =>
    promiseCreator().catch(
        error => (isBusyError(error) ? null : Promise.reject(error))
    );

export const ignoreWhatever = promiseCreator =>
    promiseCreator().catch(() => null);
