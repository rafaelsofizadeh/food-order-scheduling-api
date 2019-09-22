
daySchema.post('update', async function () {
    const update = this.getUpdate();
    const filter = this.getFilter();
    const dayId = filter._id;

    let numberOfMeals;
    try {
        const updatedDay = await Day.findById(dayId).lean().exec();
        numberOfMeals = updatedDay.meals.length;
    } catch (error) {
        logger.error(error);
        return next(error);
    }

    let status;
    if (update.$push && update.$push.meals && numberOfMeals > 0) {
        status = 'in progress';
    } else if (update.$remove && update.$remove.meals && numberOfMeals == 0) {
        status = 'empty';
    }

    if (status) {
        //https://stackoverflow.com/a/50740411
        try {
            await Day.findByIdAndUpdate(
                dayId,
                { $set: { status } }
            ).lean().exec();
        } catch (error) {
            logger.error(error);
            return next(error);
        }
    }
});

