import IntLog2 from './IntLog2';

export interface GrowingBufferOptions {
    initialSize: number;
}

export interface InternalReference {
    localOffset: number;
    bufferIndex: number;
}

export interface IOffsetCalculator {
    externalToInternal(offset: number): InternalReference;
    internalToExternal({ bufferIndex, localOffset }: InternalReference): number;
    bufferLength(bufferIndex: number): number;
}

export class GrowingBuffer {
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

export class OffsetCalculatorExponential {
    private scale: number;
    private intLog: IntLog2;

    constructor(scale: number) {
        this.scale = scale;
        this.intLog = new IntLog2({ scale });
    }

    public externalToInternal(offset: number): InternalReference {
        const { scale, intLog } = this;

        const bufferIndex = intLog.scaledLog2(offset) + 1;
        const localOffset = offset - (intLog.scaledPow2(bufferIndex) - scale);

        return { bufferIndex, localOffset };
    }

    public internalToExternal({
        bufferIndex,
        localOffset
    }: InternalReference): number {
        const { scale, intLog } = this;
        return intLog.scaledPow2(bufferIndex) - scale + localOffset;
    }

    public bufferLength(bufferIndex: number): number {
        const { scale, intLog } = this;
        return intLog.scaledPow2(bufferIndex);
    }
}
