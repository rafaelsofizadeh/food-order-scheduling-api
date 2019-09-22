const { weekListController, weekGetController, weekCreateController, weekPatchController } = require('../controllers/weekController.js');

module.exports = (api) => {
    api.route('/week')
        .get(weekListController)
        .post(weekCreateController);
    api.route('/week/:id')
        .get(weekGetController)
        .patch(weekPatchController);
};