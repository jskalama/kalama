import { sortedLastIndex, range } from 'lodash';

const table = range(0, 31).map(p => Math.pow(2, p));

//Yes, this looks weird, i know. But log2 function is called millions times
//and this is the way to return more than one value from it without having to allocate
//memory for new arrays or objects
export const log2Result = {
    rest: 0
};

export default function log2(v: number): number {
    const res = v < 1 ? -Infinity : sortedLastIndex(table, v) - 1;
    if (res >= 0) {
        log2Result.rest = v - table[res];
    } else {
        log2Result.rest = 0;
    }
    return res;
}
