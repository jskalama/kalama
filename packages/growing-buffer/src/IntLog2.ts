import { sortedLastIndex, range } from 'lodash';

export interface IntLog2Options {
    scale: number;
}

export default class IntLog2 {
    private scale: number;
    private table: number[];

    constructor(options: IntLog2Options) {
        this.scale = options.scale;
        this.initLookupTable();
    }

    private initLookupTable() {
        const { scale } = this;
        const table = range(0, 31).map(p => scale * Math.pow(2, p));
        this.table = table;
    }

    scaledPow2(v: number) {
        return this.table[v];
    }

    scaledLog2(v: number) {
        const { table, scale } = this;
        const index = sortedLastIndex(table, v + scale);
        const res = index - 1;
        return res;
    }
}
