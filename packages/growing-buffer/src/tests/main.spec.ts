import { expect } from 'chai';
import GrowingBuffer from '../GrowingBuffer';
import IntLog2 from '../IntLog2';
import { range } from 'lodash';
import OffsetCalculatorExponential from '../OffsetCalculator';

describe('IntLog2', () => {
    it('should compute integer approximation of log2', () => {
        const log2 = new IntLog2({ scale: 1 });
        range(0, 1500).forEach(i =>
            expect(log2.scaledLog2(i)).to.equal(Math.floor(Math.log2(i)))
        );
    });

    it('should compute integer approximation of log2 faster than Math.floor(Math.log2())', () => {
        const log2 = new IntLog2({ scale: 1 });
        const t0 = Date.now();

        let sum = 0;
        for (let n = 1; n < 1e6; n++) {
            sum += log2.scaledLog2(n);
        }

        const t1 = Date.now();

        for (let n = 1; n < 1e6; n++) {
            sum -= Math.floor(Math.log2(n));
        }

        const t2 = Date.now();

        expect(t2 - t1, 'performance').to.be.greaterThan(t1 - t0);

        expect(sum, 'errors').to.equal(0);
    });
});

describe('Growing Buffer', () => {
    it('should allocate', () => {
        const initialSize = 10;

        const b = new GrowingBuffer({
            initialSize,
            bufferConstructor: Uint8Array
        });

        b.allocate(72);
        expect(b.getMetrics()).to.deep.equal({
            buffersCount: 3,
            buffersSizes: [10, 20, 40]
        });

        b.allocate(1000);
        expect(b.getMetrics()).to.deep.equal({
            buffersCount: 7,
            buffersSizes: [10, 20, 40, 80, 160, 320, 640]
        });
    });
});

describe('OffsetCalculatorExponential', () => {
    const initialSize = 10;
    const mock = [[0, 2, 2], [1, 3, 13], [0, 5, 5], [2, 2, 32], [3, 2, 72]];
    const calc = new OffsetCalculatorExponential(initialSize);

    it('should calculate external offset from internal', () => {
        mock.forEach(([bufferIndex, localOffset, externalOffset]) => {
            expect(
                calc.internalToExternal({
                    bufferIndex,
                    localOffset
                })
            ).to.equal(externalOffset);
        });
    });

    it('should calculate internal offset from external', () => {
        mock.forEach(([bufferIndex, localOffset, externalOffset]) => {
            expect(calc.externalToInternal(externalOffset)).to.deep.equal({
                bufferIndex,
                localOffset
            });
        });
    });
});
