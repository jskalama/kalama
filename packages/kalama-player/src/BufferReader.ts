import GrowingBuffer from 'growing-buffer';
import { Writable, Readable } from 'stream';
import { EventEmitter } from 'events';

const BLOCK_SIZE_DEFAULT = 4096;

export interface IBufferReaderOptions {
    buffer: GrowingBuffer;
    input: Readable;
    output: Writable;
    blockSize?: number;
    preBufferSize: number;
}

export interface IBufferReaderState {
    playing: boolean;
    waiting: boolean;
    index: number;
    bufferedAll: boolean;
    bufferLength: number;
}

export default class BufferReader {
    subscribe(): any {
        this.events.on(
            'change',
            (
                state: IBufferReaderState,
                prevState: IBufferReaderState
            ): void => {
                if (state.waiting === false && prevState.waiting === true) {
                    this.events.emit('ready');
                }
            }
        );

        this.events.on(
            'change',
            (
                state: IBufferReaderState,
                prevState: IBufferReaderState
            ): void => {
                if (
                    state.waiting &&
                    (state.bufferedAll ||
                        state.index + this.preBufferSize <= state.bufferLength)
                ) {
                    console.log('Buffered enough: ', state.bufferLength);
                    this.setState({ waiting: false });
                }
            }
        );

        this.events.on(
            'change',
            (
                state: IBufferReaderState,
                prevState: IBufferReaderState
            ): void => {
                if (
                    !state.waiting &&
                    (!state.bufferedAll &&
                        state.index + this.preBufferSize >= state.bufferLength)
                ) {
                    console.log('Buffering');
                    this.setState({ waiting: true });
                }
            }
        );
    }
    private blockSize: number;
    private buffer: GrowingBuffer;
    private input: Readable;
    private output: Writable;
    private preBufferSize: number;

    private state: IBufferReaderState = {
        index: 0,
        playing: false,
        waiting: false,
        bufferedAll: false,
        bufferLength: 0
    };
    public events: EventEmitter = new EventEmitter();

    constructor(options: IBufferReaderOptions) {
        this.buffer = options.buffer;
        this.output = options.output;
        this.input = options.input;
        this.preBufferSize = options.preBufferSize;
        if (typeof options.blockSize !== 'number') {
            this.blockSize = BLOCK_SIZE_DEFAULT;
        } else {
            this.blockSize = options.blockSize;
        }
        this.seek(0);
        this.subscribe();
        this.read();
    }

    private setState(changes: Partial<IBufferReaderState>) {
        const prevState = this.state;
        this.state = { ...prevState, ...changes };
        this.events.emit('change', this.state, prevState);
    }

    private read() {
        this.input.on('data', (chunk: Buffer) => {
            for (let i = 0; i < chunk.length; i++) {
                this.buffer.push(chunk[i]); //TODO: implement blockWrite
            }
            this.setState({ bufferLength: this.buffer.length });
        });

        this.input.on('end', () => {
            this.setState({ bufferedAll: true });
            console.log('Buffered all');
        });
    }

    play(): void {
        if (this.state.playing) {
            return;
        }
        this.setState({ playing: true });
        this.writeLoop();
    }

    private writeLoop = (): void => {
        if (!this.state.playing) {
            return;
        }
        if (this.state.waiting) {
            this.output.removeListener('drain', this.writeLoop);
            this.events.once('ready', this.writeLoop);
            return;
        }
        const idx = this.state.index;

        let blockSize = Math.min(this.blockSize, this.buffer.length - idx);
        blockSize = Math.max(0, blockSize);
        if (blockSize === 0) {
            this.stop();
        }

        const slice = this.buffer.slice(idx, this.blockSize);
        this.setState({ index: idx + this.blockSize });
        this.output.write(Buffer.from(slice));
        this.output.once('drain', this.writeLoop);
    };

    private stop(): void {
        this.output.removeListener('drain', this.writeLoop);
        this.setState({ playing: false });
    }

    // private wait(): void {
    //     this.output.removeListener('drain', this.writeLoop);
    //     this.setState({ waiting: true });
    // }

    pause(): void {
        this.output.removeListener('drain', this.writeLoop);
        this.setState({ playing: false });
    }

    seek(index: number): void {
        index = index | 0;
        this.setState({ index });
    }
}
