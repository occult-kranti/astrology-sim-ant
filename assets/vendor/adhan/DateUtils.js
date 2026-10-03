// Adhan 4.4.6 — MIT, Batoul Apps. UTC civil-date adaptation: see LICENSE and PROVENANCE.md.
import { Rounding } from './Rounding.js';
export function dateByAddingDays(date, days) {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate() + days;
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
}
export function dateByAddingMinutes(date, minutes) {
    return dateByAddingSeconds(date, minutes * 60);
}
export function dateByAddingSeconds(date, seconds) {
    return new Date(date.getTime() + seconds * 1000);
}
export function roundedMinute(date, rounding = Rounding.Nearest) {
    const seconds = date.getUTCSeconds();
    let offset = seconds >= 30 ? 60 - seconds : -1 * seconds;
    if (rounding === Rounding.Up) {
        offset = 60 - seconds;
    } else if (rounding === Rounding.None) {
        offset = 0;
    }
    return dateByAddingSeconds(date, offset);
}
export function isLeapYear(year) {
    if (year % 4 !== 0) {
        return false;
    }
    if (year % 100 === 0 && year % 400 !== 0) {
        return false;
    }
    return true;
}
export function dayOfYear(date) {
    let returnedDayOfYear = 0;
    const feb = isLeapYear(date.getUTCFullYear()) ? 29 : 28;
    const months = [
        31,
        feb,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ];
    for(let i = 0; i < date.getUTCMonth(); i++){
        returnedDayOfYear += months[i];
    }
    returnedDayOfYear += date.getUTCDate();
    return returnedDayOfYear;
}
export function isValidDate(date) {
    return date instanceof Date && !isNaN(date.valueOf());
}
