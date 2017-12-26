import { expect } from 'chai';
import GrowingBuffer from '../GrowingBuffer';
import IntLog2 from '../IntLog2';
import { range } from 'lodash';
import OffsetCalculatorExponential from '../OffsetCalculator';

describe('Growing Buffer', () => {
    const initialSize = 10;

    it('should allocate', () => {
        const b = new GrowingBuffer({
            initialSize,
            bufferConstructor: Uint8Array
        });

        b.allocate(0);
        expect(b.getMetrics()).to.deep.equal({
            buffersCount: 1,
            buffersSizes: [10]
        });

        b.allocate(72);
        expect(b.getMetrics()).to.deep.equal({
            buffersCount: 4,
            buffersSizes: [10, 20, 40, 80]
        });

        b.allocate(1000);
        expect(b.getMetrics()).to.deep.equal({
            buffersCount: 7,
            buffersSizes: [10, 20, 40, 80, 160, 320, 640]
        });
    });

    it('should set and get', () => {
        const limit = 40;

        const b = new GrowingBuffer({
            initialSize,
            bufferConstructor: Uint8Array
        });

        range(0, limit).forEach(i => b.set(i, i % 256));
        range(0, limit).forEach(i => expect(b.get(i)).to.equal(i % 256));
    });
});

describe('IntLog2', () => {
    const scale = 10;
    it('should compute integer approximation of log2', () => {
        const log2 = new IntLog2({ scale });
        range(0, 1500).forEach(i =>
            expect(log2.scaledLog2(i), `i=${i}`).to.equal(
                Math.floor(Math.log2(i / scale + 1))
            )
        );
    });

    it('should compute integer approximation of log2 faster than Math.floor(Math.log2())', () => {
        const scale = 10;
        const numberOfIterations = 2e6;
        const log2 = new IntLog2({ scale });

        let sum = 0;

        const t0 = Date.now();
        for (let n = 0; n < numberOfIterations; n++) {
            sum += log2.scaledLog2(n);
        }
        const t1 = Date.now();
        for (let n = 0; n < numberOfIterations; n++) {
            sum -= Math.floor(Math.log2(n / scale + 1));
        }
        const t2 = Date.now();

        const integerTime = t1 - t0;
        const floatTime = t2 - t1;

        console.log({ floatTime, integerTime });

        expect(floatTime, 'performance').to.be.greaterThan(integerTime);
        expect(sum, 'errors').to.equal(0);

    });
});

describe('OffsetCalculatorExponential', () => {
    const initialSize = 10;
    const mock = [
        [0, 0, 0],
        [0, 1, 1],
        [0, 2, 2],
        [0, 5, 5],
        [1, 10, 20],
        [2, 2, 32],
        [3, 2, 72]
    ];
    const calc = new OffsetCalculatorExponential(initialSize);
    it('should calculate external offset from internal', () => {
        range(0, 100).forEach(i => {
            const ref = calc.externalToInternal(i);
            expect(ref.localOffset).to.be.greaterThan(-1);
        });
    });

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
