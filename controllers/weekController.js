const mongoose = require('mongoose');
const Logger = require('../utils/logger/logger.js');
const logger = new Logger();
const Week = require('../models/weekModel');
module.exports = {
    weekListController: (request, response) => {
        try {
            const weeks = await Week.find({}).lean().populate('days').exec();

            response
                .status(200)
                .json(weeks);
        } catch (error) {
            logger.error(error);
            response
                .status(500)
                .send('Error: couldn\'t get list of all weeks');
        }
    },
    weekCreateController: async (request, response) => {
        const body = request.body;

        const week = new Week({
            _id: mongoose.Types.ObjectId(),
            ...body
        });

        const validationError = await week.validate();
        if (validationError) {
            response
                .status(400)
                .json({
                    message: 'Error: couldn\'t create a new week entry due to validation error',
                    validationError
                });
        } else {
            //Triggers weekSchema's pre('save') hooks 
            const weekSaveResult = await week.save();
            response
                .status(201)
                .json({
                    message: 'Success: week entry successfully created',
                    week: weekSaveResult
                });
        }
    },
    weekEditController: (request, response) => {

    }
};