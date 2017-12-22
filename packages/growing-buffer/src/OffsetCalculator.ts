import IntLog2 from './IntLog2';

export interface InternalReference {
    localOffset: number;
    bufferIndex: number;
}

export interface IOffsetCalculator {
    externalToInternal(offset: number): InternalReference;
    internalToExternal({ bufferIndex, localOffset }: InternalReference): number;
    bufferLength(bufferIndex: number): number;
}

export default class OffsetCalculatorExponential {
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
