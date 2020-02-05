const express       = require('express');
const path          = require('path');
const port          = 4100;
const notifications = require('src/data/notifications.json');

class HttpServer {
    constructor() {
        this._app = express();
        this._app.use(express.json());
        this._app.use('/', express.static(path.join(__basedir, '/public')));

        this._router = express.Router();
        this._router.route('/').get((req, res) => {
            res.send(notifications);
        });
        this._app.use('/notifications', this._router);
    }

    async start() {
        if (this._server) return;
        this._server = this._app.listen(port, () => {
            console.log(`Server started \r\nlocalhost:${port}`);
        });
    }

    async stop() {
        if (!this._server) return;
        await new Promise(resolve => this._server.close(resolve));
        this._server = null;
    }
}

module.exports = new HttpServer();