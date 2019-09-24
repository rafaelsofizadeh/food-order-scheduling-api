const mongoose = require('mongoose');
const agenda = require('../agenda');
const Week = require('../database/models/weekModel');

module.exports = {
    weekListController: async (request, response) => {
        try {

            const weeks = await Week.find({}).lean().exec();

            return response
                .status(200)
                .json(weeks);

        } catch (error) {

            console.log(error);
            return response
                .status(500)
                .send('Error: couldn\'t get list of all weeks');

        }
    },
    weekGetController: async (request, response) => {
        const weekId = request.params.id;

        try {

            const week = await Week.findById(weekId).lean().exec();

            return response
                .status(200)
                .json(week);

        } catch (error) {

            console.log(error);
            return response
                .status(500)
                .send(`Error: couldn\'t get a week with id ${weekId}`);

        }
    },
    weekCreateController: async (request, response) => {
        const body = request.body;

        const week = new Week({
            _id: mongoose.Types.ObjectId(),
            start: new Date(body.start),
            open: new Date(body.open),
            close: new Date(body.close)
        });

        try {
            const validationError = await week.validate();

            if (validationError) {

                console.log(validationError);
                return response
                    .status(400) //General error
                    .json({
                        message: 'Error: couldn\'t create a new week entry due to validation error',
                        validationError
                    });

            } else {

                //Triggers weekSchema's pre('save') hooks 
                const weekSaveResult = await week.save();
                console.log(weekSaveResult);
                return response
                    .status(201) //Created
                    .json({
                        message: 'Success: week entry successfully created',
                        week: weekSaveResult
                    });

            }
        } catch (error) {
            console.log(error);
            return response
                .status(500) //Server error
                .send('Error: couldn\'t validate the week creation');
        }
    },
    weekEditController: async (request, response) => {
        const weekId = request.params.id;
        const body = request.body;
        //https://stackoverflow.com/a/39333479
        //Changing 'start' date won't be available
        const allowedProperties = (({ status, open, close }) =>
            ({
                status,
                open: new Date(open).valueOf(),
                close: new Date(close).valueOf()
            })
        )(body);

        try {

            const week = await Week.findById(weekId).exec();

            ['open', 'closed'].map((status) => {
                if (allowedProperties[status]) {
                    week[status] = allowedProperties[status];
                }
            });
            week.status = allowedProperties.status || week.status;
            const weekSaveResult = await week.save();

            console.log(weekSaveResult);
            return response
                .status(201) //Created
                .json({
                    message: `Success: week entry successfully edited`,
                    week: weekSaveResult
                });

        } catch (error) {
            console.log(error);
            return response
                .status(500) //Server error
                .send(`Error: couldn\'t edit the week with id ${weekId}`);
        }

    },
    weekScheduleUpdateController: async (request, response) => {
        const weekId = request.params.id;
        const update = request.body.update;

        const week = await Week.findById(weekId).exec();

        if (week.status === 'closed') {

            return response
                .status(403) //Access forbidden
                .send('Error: the week is closed for editing');

        } else {

            Object.keys(update).map((day) => {
                week.days.set(day, update[day]);
                week.days[day].finalized = true;
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