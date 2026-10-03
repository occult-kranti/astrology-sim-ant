// Adhan 4.4.6 — MIT, Batoul Apps. UTC civil-date adaptation: see LICENSE and PROVENANCE.md.
const HighLatitudeRule = {
    MiddleOfTheNight: 'middleofthenight',
    SeventhOfTheNight: 'seventhofthenight',
    TwilightAngle: 'twilightangle',
    recommended (coordinates) {
        if (coordinates.latitude > 48) {
            return HighLatitudeRule.SeventhOfTheNight;
        } else {
            return HighLatitudeRule.MiddleOfTheNight;
        }
    }
};
export default HighLatitudeRule;
