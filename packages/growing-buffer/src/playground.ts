import { equal, deepEqual } from 'assert';
import { GrowingBuffer, OffsetCalculatorExponential } from './index';
import { range } from 'lodash';
import IntLog2 from './IntLog2';

/*
B=0   B=1    B=2    B=3    B=4
0-----10-----30-----70-----150-----
*/

const initialSize = 10;
const mock = [[0, 2, 2], [1, 3, 13], [0, 5, 5], [2, 2, 32], [3, 2, 72]];
const calc = new OffsetCalculatorExponential(initialSize);
mock.forEach(([bufferIndex, localOffset, externalOffset]) => {
    equal(
        calc.internalToExternal({
            bufferIndex,
            localOffset
        }),
        externalOffset
    );
});

mock.forEach(([bufferIndex, localOffset, externalOffset]) => {
    deepEqual(calc.externalToInternal(externalOffset), {
        bufferIndex,
        localOffset
    });
});

const b = new GrowingBuffer({ initialSize });

b.allocate(72);
console.log(b.getMetrics());

b.allocate(1000);
deepEqual(b.getMetrics(), {
    buffersCount: 7,
    buffersSizes: [10, 20, 40, 80, 160, 320, 640]
});
console.log(b.getMetrics());

const log2 = new IntLog2({ scale: 1 });
range(0, 1500).forEach(i => equal(log2.scaledLog2(i), Math.floor(Math.log2(i))));

console.time('log2(n)');
let sum = 0;
for (let n = 1; n < 1e6; n++) {
    sum += log2.scaledLog2(n);
}
console.timeEnd('log2(n)');

console.time('Math.floor(Math.log2(n))');
for (let n = 1; n < 1e6; n++) {
    sum -= Math.floor(Math.log2(n));
}
console.timeEnd('Math.floor(Math.log2(n))');

equal(sum, 0);
