import { equal, deepEqual } from 'assert';
import { GrowingBuffer, OffsetCalculatorExponential } from './index';

/*
B=0   B=1    B=2    B=3    B=4
0-----10-----30-----70-----150-----
*/

const initialSize = 10;
const mock = [[1, 3, 13], [0, 5, 5], [2, 2, 32], [3, 2, 72]];

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
