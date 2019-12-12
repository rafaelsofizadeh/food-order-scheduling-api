module.exports = {
    //getDay: Sunday — 0, Monday — 1, ..., Saturday — 5
    //getFormatDay: Monday — 0, ... Sunday — 6
    getFormatDay: (date) => {
        date = new Date(date);
        return date.getDay() === 0 ? 6 : date.getDay() - 1;
    },
    addDays: (date, days) => {
        date = new Date(date);
        date.setDate(date.getDate() + days);
        return date;
    },
    getMonday: (date) => {
        date = new Date(date);
        const dayOfMonth = date.getDay();
        const difference = date.getDate() - dayOfMonth + (dayOfMonth == 0 ? -6 : 1);

        return new Date(date.setDate(difference));
    }
};