const mongoose = require('mongoose');
const agenda = require('../agenda');

const dateUtil = require('../utils/misc/extendDatePrototype');

const Week = require('../database/models/weekModel');
const User = require('../database/models/userModel');

module.exports = {
    weekListController: async (request, response) => {
        try {

            const weeks = await Week
                .find({})
                .lean()
                .populate('days.orders.product')
                .populate({
                    path: 'user',
                    select: '-weeks'
                })
                .exec();

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

            const week = await Week
                .findById(weekId)
                .lean()
                .populate('days.orders.product')
                .populate({
                    path: 'user',
                    select: '-weeks'
                })
                .exec();

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

        try {

            const week = new Week({
                _id: mongoose.Types.ObjectId(),
                user: body.userId,
                start: body.start,
                open: body.open,
                close: body.close
            });

            const user = await User.findById(body.userId).exec();
            if (!user) {
                return response
                    .status(400) //Bad request
                    .send(`Error: incorrect user id ${body.userId} for the week`);
            }

            //Triggers weekSchema's pre('save') hooks 
            const weekSaveResult = await week.save();

            if (weekSaveResult && user) {
                user.weeks.push(week._id);
                const updatedUser = await user.save();
            }

            const createdWeek = await weekSaveResult
                .populate('days.orders.product')
                .populate({
                    path: 'user',
                    select: '-weeks'
                })
                .execPopulate();

            return response
                .status(201) //Created
                .json({
                    message: 'Success: week entry created',
                    week: createdWeek
                });

        } catch (validationError) {
            console.log(validationError);
            return response
                .status(400) //Bad request
                .json({
                    message: 'Error: couldn\'t validate the week creation',
                    error: validationError.message,
                });
        }
    },
    weekEditController: async (request, response) => {
        const weekId = request.params.id;
        const body = request.body;
        //https://stackoverflow.com/a/39333479
        //Changing anything except 'status, open, close' won't be available
        const allowedProperties = (({ status, open, close }) => ({ status, open, close }))(body);

        try {

            const week = await Week.findById(weekId).exec();

            ['open', 'close'].map((action) => {
                if (allowedProperties[action]) {
                    const setDate = allowedProperties[action];
                    week[action] = allowedProperties[action];

                    agenda.cancel(
                        {
                            name: 'set week status',
                            'data.weekId': weekId,
                            'data.status': action
                        },
                        (error, removed) => {
                            console.log(error);

                            if (!removed) {
                                console.log(`Agenda: something\'s wrong, agenda jobs for week ${weekId} with status ${action} haven't been deleted`);
                            }

                            agenda.schedule(setDate, 'set week status', { weekId, action });
                        }
                    );
                }
            });
            week.status = allowedProperties.status || week.status;
            const editedWeek = await (await week.save())
                .populate('days.orders.product')
                .populate({
                    path: 'user',
                    select: '-weeks'
                })
                .execPopulate();

            console.log(editedWeek);
            return response
                .status(201) //Created
                .json({
                    message: `Success: week entry edited`,
                    week: editedWeek
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

        if (week.status === 'close') {

            return response
                .status(403) //Access forbidden
                .send('Error: the week is closed for editing');

        } else {

            try {

                Object.keys(update).map((day) => {
                    //Control that the day's date is corresponding to its place in array
                    //DETERMINE?: return error or continue
                    update[day].date = week.days[day].date;
                    week.days.set(day, update[day]);
                    week.days[day].finalized = true;
                });
                const updatedWeek = await (await week.save())
                    .populate('days.orders.product')
                    .populate({
                        path: 'user',
                        select: '-weeks'
                    })
                    .execPopulate();

                return response
                    .status(205) //Reset content
                    .json({
                        message: 'Success: week schedule has been successfully updated',
                        updatedWeek
                    });

            } catch (error) {
                console.log(error);
                return response
                    .status(500) //Server error
                    .send(`Error: couldn\'t update schedule of the week with id ${weekId}`);
            }

        }
    }
};