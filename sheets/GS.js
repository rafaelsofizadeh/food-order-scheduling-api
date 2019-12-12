const { google } = require('googleapis');
const credentials = require('./config/credentials.json');

module.exports = async () => {
    try {
        const auth = new google.auth.JWT(
            credentials.clientEmail,
            null,
            credentials.privateKey,
            ['https://www.googleapis.com/auth/spreadsheets']
        );

        await auth.authorize();
        const GSApi = google.sheets({ version: 'v4', auth });

        return [null, GSApi];
    } catch (error) {
        console.log('Error: unable to connect to Google API');
        return [error, null];
    }
};