const { weekListController, weekGetController, weekCreateController, weekEditController, weekScheduleUpdateController } = require('../controllers/weekController.js');

module.exports = (api) => {
    api.route('/week')
        .get(weekListController)
        .post(weekCreateController);
    api.route('/week/:id')
        .get(weekGetController)
        .post(weekEditController)
        .patch(weekScheduleUpdateController);
};