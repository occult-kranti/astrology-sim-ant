// Adhan 4.4.6 — MIT, Batoul Apps. UTC civil-date adaptation: see LICENSE and PROVENANCE.md.
export const Madhab = {
    Shafi: 'shafi',
    Hanafi: 'hanafi'
};
export function shadowLength(madhab) {
    switch(madhab){
        case Madhab.Shafi:
            return 1;
        case Madhab.Hanafi:
            return 2;
        default:
            throw 'Invalid Madhab';
    }
}
