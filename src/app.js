const httpServer = require('src/http/httpServer');

class App {
    async start() {
        await httpServer.start();
    }

    async stop() {
        await httpServer.stop();
    }
}

module.exports = new App();