function KeyValueTime() {
    const valueTimeMap = new Map();

    this.set = (value, time) => valueTimeMap.set(value, time);

    this.get = (time) => findCorrespondingEntry(time);

    function findCorrespondingEntry(time) {
        const entries = [...valueTimeMap.entries()];
        console.log(entries, time);

        let start = 0, end = entries.length - 1;

        while (start < end) {
            const middle = Math.floor((start + end) / 2);

            if (entries[middle][1] === time) {
                return entries[middle];
            } else if (entries[middle][1] < time) {
                start = middle + 1;
            } else if (entries[middle][1] > time) {
                end = middle - 1;
            }
        }

        console.log(start, end);
        return entries[start] || null;
    };
}

const TimeMap = function () {
    this.keyValueTimeMap = new Map();
};

TimeMap.prototype.set = function (key, value, time) {
    if (this.keyValueTimeMap.has(key)) {
        this.keyValueTimeMap.get(key).set(value, time);
    } else {
        const keyValueTime = new KeyValueTime();
        keyValueTime.set(value, time);
        this.keyValueTimeMap.set(key, keyValueTime);
    }
};

TimeMap.prototype.get = function (key, time) {
    if (this.keyValueTimeMap.has(key)) {
        const entry = this.keyValueTimeMap.get(key).get(time);

        return entry === null ? '' : entry[0];
    } else {
        return '';
    }
};