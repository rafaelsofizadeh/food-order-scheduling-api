const { google } = require('googleapis');
const GS = require('./GS');
const Spreadsheet = require('./Spreadsheet');

module.exports = async () => {
    const [connectionError, GSApi] = await GS();
    if (connectionError) {
        console.log(connectionError);
        process.exit(1);
    }

    const spreadsheet = new Spreadsheet('1pZzaNol5ILgkvO1glRAtXqjFwRvW_js8nILIA8QTGVU', GSApi);
    await spreadsheet.getDataForDate(new Date('09-27-2019'));
};