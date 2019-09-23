const Agenda = require('agenda');
const fs = require('fs');

const Logger = require('./utils/logger/logger.js');
const logger = new Logger();

const config = require('./config.json');
const connectionString = config['connection']['mongodb']['connection_string'];
const connectionOptions = { db: { address: connectionString } };

const agenda = new Agenda(connectionOptions);

try {
    fs.readdirSync(path.join(__dirname, 'jobs')).map((job) => {
        require(`./jobs/${job}`)(agenda);
    });

    agenda.start();
    module.exports = agenda;
} catch (error) {
    logger.error('Error: failed jobs setup');
    process.exit(1);
}