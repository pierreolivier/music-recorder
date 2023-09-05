const util = require('util');
const exec = util.promisify(require('child_process').exec);

class Api {
    static COMMAND = 'screen -d -m ffmpeg -f avfoundation -ac 2 -i :0 -c:a aac -ab 96k -y test.aac';

    super() {
        console.log('NEW');
    }

    async running(res) {
        const list = await this.exec('ps aux | grep ffmpeg', res);
        console.log('RUNNING', list);
        return list.toLowerCase().includes(Api.COMMAND);
    }

    async parse(req, res) {

        switch (req.url) {
            case '/api/list':
                const list = await this.exec('ps aux | grep ffmpeg', res);

                if (list !== undefined) {
                    res.send(list.replace(/(?:\r\n|\r|\n)/g, '<br>'))
                }

                break;

            case '/api/stop':
                const stop = await this.exec('killall ffmpeg', res);

                if (stop !== undefined) {
                    res.send('ok');
                }

                break;

            case '/api/start':
                const start = await this.exec(Api.COMMAND, res);

                if (start !== undefined) {
                    res.send('ok');
                }

                break;

            case '/api/running':
                if (await this.running(res) === true) {
                    res.send('true');
                } else {
                    res.send('false');
                }

                break;

            default:
                res.sendStatus(404);

                break;
        }
    }

    async exec(cmd, res) {
        try {
            const {stdout, stderr} = await exec(cmd);
            console.log('stdout:', stdout, typeof stdout);
            console.log('stderr:', stderr);

            return stdout;
        } catch (err) {
            console.error(err);

            res.send(err.stderr.replace(/(?:\r\n|\r|\n)/g, '<br>'));
        }

        return undefined;
    }
}

const api = new Api();

export default api;
