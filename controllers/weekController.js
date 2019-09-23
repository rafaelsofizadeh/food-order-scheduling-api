const mongoose = require('mongoose');
const Logger = require('../utils/logger/logger.js');
const logger = new Logger();
const Week = require('../database/models/weekModel');

module.exports = {
    weekListController: (request, response) => {
        try {

            const weeks = await Week.find({}).lean().populate('days').exec();

            return response
                .status(200)
                .json(weeks);

        } catch (error) {

            logger.error(error);
            return response
                .status(500)
                .send('Error: couldn\'t get list of all weeks');

        }
    },
    weekGetController: (request, response) => {
        const weekId = request.params.id;

        try {

            const week = await Week.findById(weekId).lean().populate('days').exec();

            return response
                .status(200)
                .json(week);

        } catch (error) {

            logger.error(error);
            return response
                .status(500)
                .send(`Error: couldn\'t get a week with id ${weekId}`);

        }
    },
    weekCreateController: async (request, response) => {
        const body = request.body;

        const week = new Week({
            _id: mongoose.Types.ObjectId(),
            ...body
        });

        try {
            const validationError = await week.validate();

            if (validationError) {

                return response
                    .status(400) //General error
                    .json({
                        message: 'Error: couldn\'t create a new week entry due to validation error',
                        validationError
                    });

            } else {

                //Triggers weekSchema's pre('save') hooks 
                const weekSaveResult = await week.save();
                return response
                    .status(201) //Created
                    .json({
                        message: 'Success: week entry successfully created',
                        week: weekSaveResult
                    });

            }
        } catch (error) {
            return response
                .status(500) //Server error
                .send('Error: couldn\'t validate the week creation');
        }
    },
    weekUpdateController: (request, response) => {
        const weekId = request.params.id;
        const update = request.body.update;

        const week = await Week.findById(weekId).lean().exec();

        if (week.status === 'closed') {

            return response
                .status(403) //Access forbidden
                .send('Error: the week is closed for editing');

        } else {

            Object.keys(update).map((day) => {
                week.days.set(day, update[day]);
            });
            const updatedWeek = await week.save();

            return response
                .status(205) //Reset content
                .json({
                    message: 'Success: week has been successfully updated',
                    updatedWeek
                });

        }
    }
};