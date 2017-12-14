export interface GrowingBufferOptions {
    initialSize: number;
}

export interface InternalReference {
    localOffset: number;
    bufferIndex: number;
}

export interface IOffsetCalculator {
    externalToInternal(initialSize: number, offset: number): InternalReference;

    internalToExternal(
        initialSize: number,
        { bufferIndex, localOffset }: InternalReference
    ): number;

    bufferLength(initialSize: number, bufferIndex: number): number;
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
        const { bufferIndex } = this.calc.externalToInternal(
            this.initialSize,
            offset
        );

        if (bufferIndex < this.buffers.length) {
            return;
        }

        for (let i = this.buffers.length; i < bufferIndex; i++) {
            this.allocateNext();
        }
    }

    protected allocateNext() {
        const bufLen = this.calc.bufferLength(
            this.initialSize,
            this.buffers.length
        );
        this.buffers.push(new ArrayBuffer(bufLen));
    }

    constructor(options: GrowingBufferOptions) {
        this.initialSize = options.initialSize;
        this.calc = OffsetCalculatorExponential;
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
    public static externalToInternal(
        initialSize: number,
        offset: number
    ): InternalReference {
        const bufferIndex = Math.floor(Math.log2(offset / initialSize)) + 1;
        const localOffset =
            offset - (Math.pow(2, bufferIndex) - 1) * initialSize;
        return { bufferIndex, localOffset };
    }

    public static internalToExternal(
        initialSize: number,
        { bufferIndex, localOffset }: InternalReference
    ): number {
        const result =
            (Math.pow(2, bufferIndex) - 1) * initialSize + localOffset;
        return result;
    }

    public static bufferLength(
        initialSize: number,
        bufferIndex: number
    ): number {
        return Math.pow(2, bufferIndex) * initialSize;
    }
}
