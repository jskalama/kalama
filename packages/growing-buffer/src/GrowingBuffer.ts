import IntLog2 from './IntLog2';
import OffsetCalculatorExponential, {
    InternalReference,
    IOffsetCalculator
} from './OffsetCalculator';
import IIndexable from './IIndexable';
import { ok as assertOk } from 'assert';

export type TypedArrayConstructor =
    | typeof Int8Array
    | typeof Uint8Array
    | typeof Int16Array
    | typeof Uint16Array
    | typeof Int32Array
    | typeof Uint32Array
    | typeof Uint8ClampedArray
    | typeof Float32Array
    | typeof Float64Array;

export type TypedArray =
    | Int8Array
    | Uint8Array
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Uint8ClampedArray
    | Float32Array
    | Float64Array;

export interface GrowingBufferOptions {
    initialSize: number;
    bufferConstructor: TypedArrayConstructor;
}

export interface IBlockAllocationDescriptor {
    boundary: number | null;
    bufferIndex: number;
    offset: number;
    secondaryBufferIndex?: number;
    secondaryOffset?: number;
}

export default class GrowingBuffer {
    protected initialSize: number;
    protected buffers: Array<TypedArray>;
    protected calc: IOffsetCalculator;
    protected bufferConstructor: TypedArrayConstructor;
    protected _length: number = 0;

    get length() {
        return this._length;
    }

    public slice(start: number, length: number) {
        return makeSlice(this, start, length);
    }

    public get(offset: number): number {
        const { bufferIndex, localOffset } = this.calc.externalToInternal(
            offset
        );
        if (bufferIndex >= this.buffers.length) {
            return 0;
        }
        return this.buffers[bufferIndex][localOffset];
    }

    public set(offset: number, data: number) {
        const { bufferIndex, localOffset } = this.allocate(offset);
        this.buffers[bufferIndex][localOffset] = data;
        if (offset >= this._length) {
            this._length = offset + 1;
        }
    }

    public push(data: number) {
        this.set(this._length, data);
    }

    public pushBlock(inputBuffer: Buffer) {
        const inputBufferLength = inputBuffer.length;

        const {
            boundary,
            bufferIndex,
            offset,
            secondaryBufferIndex,
            secondaryOffset
        } = this.allocateBlock(this._length, inputBufferLength);

        const buffer = this.buffers[bufferIndex];

        if (boundary === null) {
            for (let i = 0; i < inputBufferLength; i++) {
                buffer[i + offset] = inputBuffer[i];
            }
        } else if (
            typeof secondaryBufferIndex === 'number' &&
            typeof secondaryOffset === 'number'
        ) {
            for (let i = 0; i < boundary; i++) {
                buffer[i + offset] = inputBuffer[i];
            }

            const secondaryBuffer = this.buffers[secondaryBufferIndex];

            for (let i = boundary; i < inputBufferLength; i++) {
                secondaryBuffer[i + secondaryOffset] = inputBuffer[i];
            }
        } else {
            throw new Error('Block allocation descriptor corrupted');
        }

        this._length += inputBufferLength;
    }

    public allocateBlock(
        start: number,
        length: number
    ): IBlockAllocationDescriptor {
        assertOk(length < this.initialSize, 'length < this.initialSize');
        const secondaryBufferReference = this.allocate(start + length - 1);
        const boundary = this.calc.internalToExternal({
            ...secondaryBufferReference,
            localOffset: 0
        });
        const offset = this.calc.externalToInternal(start).localOffset;
        if (boundary <= start) {
            return {
                boundary: null,
                offset,
                bufferIndex: secondaryBufferReference.bufferIndex
            };
        } else {
            assertOk(
                secondaryBufferReference.bufferIndex >= 1,
                'secondaryBufferReference.bufferIndex >= 1'
            );
            return {
                boundary: boundary - start,
                offset,
                bufferIndex: secondaryBufferReference.bufferIndex - 1,
                secondaryOffset: start - boundary,
                secondaryBufferIndex: secondaryBufferReference.bufferIndex
            };
        }
    }

    public allocate(offset: number): InternalReference {
        const { bufferIndex, localOffset } = this.calc.externalToInternal(
            offset
        );

        for (let i = this.buffers.length; i <= bufferIndex; i++) {
            this.allocateNext();
        }

        return { bufferIndex, localOffset };
    }

    protected allocateNext() {
        const bufLen = this.calc.bufferLength(this.buffers.length);
        this.buffers.push(new this.bufferConstructor(bufLen));
    }

    constructor(options: GrowingBufferOptions) {
        this.initialSize = options.initialSize;
        this.calc = new OffsetCalculatorExponential(this.initialSize);
        this.buffers = [];
        this.bufferConstructor = options.bufferConstructor;
    }

    public getMetrics(): any {
        return {
            buffersCount: this.buffers.length,
            buffersSizes: this.buffers.map(_ => _.byteLength)
        };
    }
}

const CODE_0 = '0'.charCodeAt(0);
const CODE_9 = '9'.charCodeAt(0);

const isIterator = (v: any): boolean => {
    return v === Symbol.iterator;
};

const makeSlice = (
    target: GrowingBuffer,
    start: number,
    length: number
): IIndexable => {
    const iter = function*() {
        const end = start + length - 1;
        for (let i = start; i <= end; i++) {
            yield target.get(i);
        }
    };

    return new Proxy<any>(target, {
        get(target: GrowingBuffer, prop: string) {
            if (isIterator(prop)) {
                return iter;
            }
            const c = prop.charCodeAt(0);
            if (c >= CODE_0 && c <= CODE_9) {
                return target.get(parseInt(prop, 10) + start);
            } else if (typeof prop === 'string' && prop === 'length') {
                return length;
            } else {
                return undefined;
            }
        }
    });
};
