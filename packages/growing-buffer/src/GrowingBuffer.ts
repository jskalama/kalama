import IntLog2 from './IntLog2';
import OffsetCalculatorExponential, {
    InternalReference,
    IOffsetCalculator
} from './OffsetCalculator';

export interface GrowingBufferOptions {
    initialSize: number;
}

export default class GrowingBuffer {
    protected initialSize: number;
    protected buffers: Array<ArrayBuffer>;
    protected calc: IOffsetCalculator;

    // public get (offset) : number {

    // }

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
        this.buffers.push(new ArrayBuffer(bufLen));
    }

    constructor(options: GrowingBufferOptions) {
        this.initialSize = options.initialSize;
        this.calc = new OffsetCalculatorExponential(this.initialSize);
        this.buffers = [];
    }

    public getMetrics(): any {
        return {
            buffersCount: this.buffers.length,
            buffersSizes: this.buffers.map(_ => _.byteLength)
        };
    }
}
