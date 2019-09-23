//getDay: Sunday — 0, Monday — 1, ..., Saturday — 5
//getFormatDay: Monday — 0, ... Sunday — 6
Date.prototype.getFormatDay = function (date) {
    return this.getDay(date) === 0 ? 6 : this.getDay(date) - 1;
};

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};