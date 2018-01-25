import { CLIApplication, command } from './CLIApplication';

@CLIApplication
export default class KalamaApp {
    @command(['play', '*'], 'Play')
    public async play() {}

    @command('playlist <file>', 'Save playlist file as M3U file')
    public async playlist({ file: string }) {}

    @command(['share', 'qr'], 'Share a QR code to your mobile phone')
    public async share() {}

    @command('get <directory>', 'Download tracks to the directory')
    public async download({ directory: string }) {}
}

const app = new KalamaApp();

