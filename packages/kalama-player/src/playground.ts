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

// const fstream = createReadStream(
//     './src/samples/kid-a/01_radiohead_everything_in_its_right_place_myzuka.me.mp3'
//     // './src/samples/Цинга/01_adaptatsiya_leto_lubvi_myzuka.me.mp3'
//     // './src/samples/1995-2013-CD1/01_boris_grebenshikov_akvarium_severnii_tsvet_bloom_of_the_north_floraiso_myzuka.me.mp3'
// );
const decoder = new lame.Decoder();

// fstream.pipe(decoder);
httpStream.pipe(decoder);

const receiver = new GrowingBuffer({
    initialSize: 500000,
    bufferConstructor: Uint8Array
});

// decoder.on('data', function(chunk: Buffer) {
//     for (let i = 0; i < chunk.length; i++) {
//         receiver.push(chunk[i]);
//     }
// });

const reader = new BufferReader({
    buffer: receiver,
    output: speaker,
    input: decoder,
    preBufferSize: 1000000,
    blockSize: 4096
});

reader.play();
