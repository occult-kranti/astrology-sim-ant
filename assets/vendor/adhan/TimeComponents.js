// Adhan 4.4.6 — MIT, Batoul Apps. UTC civil-date adaptation: see LICENSE and PROVENANCE.md.
export default class TimeComponents {
    hours;
    minutes;
    seconds;
    constructor(num){
        this.hours = Math.floor(num);
        this.minutes = Math.floor((num - this.hours) * 60);
        this.seconds = Math.floor((num - (this.hours + this.minutes / 60)) * 60 * 60);
        return this;
    }
    utcDate(year, month, date) {
        return new Date(Date.UTC(year, month, date, this.hours, this.minutes, this.seconds));
    }
}
