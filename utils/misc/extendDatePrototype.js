//getDay: Sunday — 0, Monday — 1, ..., Saturday — 5
//getFormatDay: Monday — 0, ... Sunday — 6
Date.prototype.getFormatDay = (date) => this.getDay(date) === 0 ? 6 : this.getDay(date) - 1;

Date.prototype.addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};