//TODO: Functions with batchUpdate() look similar
const mongoose = require('mongoose');

const dateUtil = require('../utils/misc/extendDatePrototype');

const Product = require('../database/models/productModel');
const Week = require('../database/models/weekModel');
const User = require('../database/models/userModel');



function Spreadsheet(id, GSApi) {
    const _this = this;
    _this.spreadsheetId = id;
    _this.GSApi = GSApi;

    this.getDataForDate = async function (date) {
        const userOrderTuples = await prepareUserOrderData(date);
        const products = await Product.find({}).lean().exec();
        const users = await User.find({}).lean().exec();

        const table = products.map((product) => {
            product.orders = users.map((user) => {
                const foundUserOrderTuple = (userOrderTuples.filter((tuple) => tuple.user._id === user._id))[0];

                if (foundUserOrderTuple) {
                    const productOrder = (foundUserOrderTuple.orders.filter((order) => order.product === product._id))[0];

                    return {
                        user: foundUserOrderTuple.user,
                        quantity: productOrder.quantity
                    };
                } else {
                    return null;
                }
            });

            return product;
        });

        return table;
    };

    async function prepareUserOrderData(date) {
        const weekStart = dateUtil.getMonday(date);

        const weeks = await Week
            .find({ start: weekStart })
            .populate({
                path: 'user',
                select: '-weeks'
            })
            .lean()
            .exec();

        return weeks.map((week) => {
            const daysNeeded = week.days.filter((day) => {
                console.log(day.date);
                return day.date === date;
            });
            console.log(daysNeeded);
            return {
                user: week.user,
                orders: daysNeeded[0].orders || []
            };
        });
    }

    async function addEmptySheetByTemplate(newSheetName) {
        const [sheetInfoError, sheetInfo] = await getSheetInfo();
        if (sheetInfoError) {
            console.log(sheetInfoError);
            return null;
        } else {
            console.log('SHEET INFO', sheetInfo, '\n\n');
        }

        const templateSheet = findSheetByName(sheetInfo, 'TEMPLATE');
        console.log('TEMPLATE INFO', templateSheet, '\n\n');

        const [duplicateError, duplicateResult] = await duplicateSheet(templateSheet.sheetId, newSheetName);
        if (duplicateError) {
            console.log(duplicateError);
            return null;
        } else {
            console.log('DUPLICATE RESULT', duplicateResult);
        }

        //-------------------------------PRIVATE FUNCTIONS-------------------------------

        function findSheetByName(sheetInfo, name) {
            return sheetInfo.filter((sheet) => sheet.title === name);
        }

        async function getSheetInfo() {
            const request = {
                spreadsheetId: _this.spreadsheetId,
                includeGridData: false,
            };

            try {
                const result = await _this.GSApi.spreadsheets.get(request);
                const sheetInfo = result.data.sheets.map((sheetObject) => sheetObject.properties);
                return [null, sheetInfo];
            } catch (error) {
                console.log('Error: unable to get sheet info');
                return [error, null];
            }
        }

        async function duplicateSheet(sourceSheetId, newSheetName) {
            const duplicateSheetRequest = {
                spreadsheetId: _this.spreadsheetId,
                resource: {
                    requests: [{
                        duplicateSheet: {
                            sourceSheetId,
                            newSheetName
                        }
                    }]
                }
            };

            try {
                const duplicateSheetResult = await GSApi.spreadsheets.batchUpdate(duplicateSheetRequest);
                console.log(duplicateSheetResult);

                return [null, duplicateSheetResult.data.replies[0].properties];
            } catch (error) {
                console.log(`Error: unable to duplicate sheet', 'Arguments: ${arguments}`);
                return [error, null];
            }
        }
    }
}

module.exports = Spreadsheet;