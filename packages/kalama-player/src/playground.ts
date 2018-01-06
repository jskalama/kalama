import { createReadStream, fstat } from 'fs';
import lame = require('lame');
import Speaker = require('speaker');
import mp3Parser = require('mp3-parser');
import GrowingBuffer from 'growing-buffer';
import { Writable } from 'stream';
import mp3header = require('mp3-header');
import BufferReader from './BufferReader';
import request = require('request');
import samples from './samples';

process.title = 'AXAA';

const speaker: Writable = new Speaker();

const httpStream = request(samples.aviamarch);

const decoder = new lame.Decoder();

httpStream.pipe(decoder);

const receiver = new GrowingBuffer({
    initialSize: 1e6,
    bufferConstructor: Uint8Array
});

const reader = new BufferReader({
    buffer: receiver,
    output: speaker,
    input: decoder,
    preBufferSize: 1e6,
    blockSize: 256
});

reader.play();
