import { equal, deepEqual } from 'assert';
import { GrowingBuffer, OffsetCalculatorExponential } from './index';
import log2, { log2Result } from './log2';
import { range } from 'lodash';

/*
B=0   B=1    B=2    B=3    B=4
0-----10-----30-----70-----150-----
*/

const initialSize = 10;
const mock = [[0, 2, 2], [1, 3, 13], [0, 5, 5], [2, 2, 32], [3, 2, 72]];

mock.forEach(([bufferIndex, localOffset, externalOffset]) => {
    equal(
        OffsetCalculatorExponential.internalToExternal(initialSize, {
            bufferIndex,
            localOffset
        }),
        externalOffset
    );
});

mock.forEach(([bufferIndex, localOffset, externalOffset]) => {
    deepEqual(
        OffsetCalculatorExponential.externalToInternal(
            initialSize,
            externalOffset
        ),
        {
            bufferIndex,
            localOffset
        }
    );
});

const b = new GrowingBuffer({ initialSize });

b.allocate(72);
console.log(b.getMetrics());

b.allocate(1000);
console.log(b.getMetrics());

range(0, 5, 0.2).forEach(i =>
    console.log(i, log2(i), log2Result.rest, Math.floor(Math.log2(i)))
);

range(0, 1500).forEach(i => equal(log2(i), Math.floor(Math.log2(i))));

console.time('log2(n)');
let sum = 0;
for (let n = 1; n < 1e6; n++) {
    sum += log2(n);
}
console.timeEnd('log2(n)');

console.time('Math.floor(Math.log2(n))');
for (let n = 1; n < 1e6; n++) {
    sum -= Math.floor(Math.log2(n));
}
console.timeEnd('Math.floor(Math.log2(n))');

equal(sum, 0);
