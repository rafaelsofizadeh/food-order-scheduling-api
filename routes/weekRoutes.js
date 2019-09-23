const { weekListController, weekGetController, weekCreateController, weekUpdateController } = require('../controllers/weekController.js');

module.exports = (api) => {
    api.route('/week')
        .get(weekListController)
        .post(weekCreateController);
    api.route('/week/:id')
        .get(weekGetController)
        .patch(weekUpdateController);
};