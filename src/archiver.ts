import Аrchiver = require('archiver-promise');

export const createArchive = async (
    directory: string,
    archiveFile: string
): Promise<void> => {
    const arch = Аrchiver(archiveFile, { store: true });
    arch.directory(directory, false);
    return arch.finalize();
};
