import IntLog2 from './IntLog2';
import OffsetCalculatorExponential, {
    InternalReference,
    IOffsetCalculator
} from './OffsetCalculator';
import IIndexable from './IIndexable';

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

export default class GrowingBuffer {
    protected initialSize: number;
    protected buffers: Array<TypedArray>;
    protected calc: IOffsetCalculator;
    protected bufferConstructor: TypedArrayConstructor;
    protected _length: number = 0;

    get length() {
        return this._length;
    }

    //TODO: replace with immutable proxy
    public slice(start: number, length: number) {
        return makeSlice(this, start, length);
        // const buf = new this.bufferConstructor(length);
        // for (
        //     let index = start, outIndex = 0;
        //     outIndex < length;
        //     index++, outIndex++
        // ) {
        //     buf[outIndex] = this.get(index);
        // }
        // return buf;
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

const makeSlice = (
    target: GrowingBuffer,
    from: number,
    length: number
): IIndexable => {
    return new Proxy<any>(target, {
        get(target: GrowingBuffer, prop: string) {
            const c = prop.charCodeAt(0);
            if (c >= CODE_0 && c <= CODE_9) {
                return target.get(parseInt(prop, 10) + from);
            } else if (typeof prop === 'string' && prop === 'length') {
                return length;
            } else {
                return undefined;
            }
        }
    });
};
