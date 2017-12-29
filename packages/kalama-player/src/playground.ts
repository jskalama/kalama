import { createReadStream, fstat } from 'fs';
import lame = require('lame');
import Speaker = require('speaker');
import GrowingBuffer from 'growing-buffer';
import { Writable } from 'stream';

const speaker: Writable = new Speaker();

const fstream = createReadStream(
    './src/samples/kid-a/01_radiohead_everything_in_its_right_place_myzuka.me.mp3'
    // './src/samples/mb-packet/МБ Пакет - Вся правда о Юре Гагарине.mp3'
);
const decoder = new lame.Decoder();

fstream.pipe(decoder);

const receiver = new GrowingBuffer({
    initialSize: 500000,
    bufferConstructor: Uint8Array
});

decoder.on('data', function(chunk: Buffer) {
    for (let i = 0; i < chunk.length; i++) {
        receiver.push(chunk[i]);
    }
    // console.log(chunk.length / 4);
});

decoder.on('end', function() {
    const ch = Buffer.from(receiver.slice(4e6, 4e6));
    pipeToSpeaker();
});

decoder.on('format', function(format) {
    console.log('format:');
    console.log(format);
});

decoder.on('id3v1', function(id3) {
    console.log('id3v1:');
    console.log(id3);
});

decoder.on('id3v2', function(id3) {
    console.log('id3v2:');
    console.log(id3);
});

const pipeToSpeaker = () => {
    const chunkSize = 4096;
    let current = 0;
    const doWrite = () => {
        const chunk = Buffer.from(receiver.slice(current, chunkSize));
        current += chunkSize;
        let allowsWrite;
        do {
            allowsWrite = speaker.write(chunk);
        } while (allowsWrite);
        speaker.once('drain', doWrite);
    };
    doWrite();
};
