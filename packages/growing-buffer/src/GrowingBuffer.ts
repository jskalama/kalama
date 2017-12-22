import IntLog2 from './IntLog2';
import OffsetCalculatorExponential, {
    InternalReference,
    IOffsetCalculator
} from './OffsetCalculator';

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

    public get(offset: number): number {
        const { bufferIndex, localOffset } = this.calc.externalToInternal(
            offset
        );
        if (bufferIndex >= this.buffers.length) {
            return 0;
        }
        return this.buffers[bufferIndex][localOffset];
    }

    // public set () : number {

    // }

    public allocate(offset: number) {
        const { bufferIndex } = this.calc.externalToInternal(offset);

        if (bufferIndex < this.buffers.length) {
            return;
        }

        for (let i = this.buffers.length; i < bufferIndex; i++) {
            this.allocateNext();
        }
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
