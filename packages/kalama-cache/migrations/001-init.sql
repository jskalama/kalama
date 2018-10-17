-- Up

CREATE TABLE `items` (
    `hash` VARCHAR PRIMARY KEY,
    `accessTime` INTEGER NOT NULL,
    `size` INTEGER NOT NULL
);

CREATE INDEX `idxAccessTime` ON `items` (`accessTime`);

-- Down
DROP INDEX `idxAccessTime`;
DROP TABLE `items`;