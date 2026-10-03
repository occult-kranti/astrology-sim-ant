// Adhan 4.4.6 — MIT, Batoul Apps. UTC civil-date adaptation: see LICENSE and PROVENANCE.md.
import { dateByAddingDays, dateByAddingSeconds, roundedMinute } from './DateUtils.js';
import PrayerTimes from './PrayerTimes.js';
export default class SunnahTimes {
    middleOfTheNight;
    lastThirdOfTheNight;
    constructor(prayerTimes){
        const date = prayerTimes.date;
        const nextDay = dateByAddingDays(date, 1);
        const nextDayPrayerTimes = new PrayerTimes(prayerTimes.coordinates, nextDay, prayerTimes.calculationParameters);
        const nightDuration = (nextDayPrayerTimes.fajr.getTime() - prayerTimes.maghrib.getTime()) / 1000.0;
        this.middleOfTheNight = roundedMinute(dateByAddingSeconds(prayerTimes.maghrib, nightDuration / 2));
        this.lastThirdOfTheNight = roundedMinute(dateByAddingSeconds(prayerTimes.maghrib, nightDuration * (2 / 3)));
    }
}
