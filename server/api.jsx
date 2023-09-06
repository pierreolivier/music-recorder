const util= require('util');
const exec = util.promisify(require('child_process').exec);

class Api {
    static COMMAND = 'screen -d -m ffmpeg -f alsa -c:a pcm_s24le -channels 2 -sample_rate 48000 -i hw:3,0 -acodec libmp3lame -ab 320k "$(date).mp3"';

    super() {
    }

    async init() {
        const name = await this.exec('uname');
        if (name.includes('Darwin')) {
            Api.COMMAND = 'screen -d -m ffmpeg -f avfoundation -ac 2 -i :0 -c:a aac -ab 96k -y test.aac';
        }
    }

    async running(res) {
        const list = await this.exec('ps aux | grep ffmpeg', res);
        return list.toLowerCase().includes(Api.COMMAND);
    }

    async parse(req, res) {

        switch (req.url) {
            case '/api/list/process': {
                const list = await this.exec('ps aux | grep ffmpeg', res);

                if (list !== undefined) {
                    res.send(list.replace(/(?:\r\n|\r|\n)/g, '<br>'))
                }

                break;
            }

            case '/api/list/card': {
                const ffmpeg = await this.exec('ffmpeg -devices');
                const arecord = await this.exec('arecord -l');

                if (ffmpeg !== undefined && arecord !== undefined) {
                    res.send('ffmpeg:\n' + ffmpeg.concat('\n\n\narecord:\n' + arecord).replace(/(?:\r\n|\r|\n)/g, '<br>'))
                }

                break;
            }

            case '/api/stop': {
                const stop = await this.exec('killall ffmpeg && sync', res);

                if (stop !== undefined) {
                    res.send('ok');
                }

                break;
            }

            case '/api/start': {
                const start = await this.exec(Api.COMMAND, res);

                if (start !== undefined) {
                    res.send('ok');
                }

                break;
            }

            case '/api/running': {
                if (await this.running(res) === true) {
                    res.send('true');
                } else {
                    res.send('false');
                }

                break;
            }

            default: {
                res.sendStatus(404);

                break;
            }
        }
    }

    async exec(cmd, res) {
        console.log('Starting command "' + cmd + '"...');

        try {
            const {stdout, stderr} = await exec(cmd);
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);

            return stdout;
        } catch (err) {
            console.error(err);

            res?.send(err.stderr.replace(/(?:\r\n|\r|\n)/g, '<br>'));

            if (res === undefined) {
                return err;
            }
        }

        return undefined;
    }
}

const api = new Api();

export default api;
