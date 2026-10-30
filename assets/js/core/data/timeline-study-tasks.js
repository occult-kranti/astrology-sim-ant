// Presentation definitions over existing, explicitly editorial study profiles.
// This module supplies no ephemeris, religious authority or outcome prediction.
import { HORIZON_PURPOSES, HORIZON_RANKING_SOURCES } from '../horizon-ranking.js';

const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
const copy = value => JSON.parse(JSON.stringify(value));
const profiles = new Map(HORIZON_PURPOSES.map(row => [row.id, row]));
const rankingSources = new Map(HORIZON_RANKING_SOURCES.map(row => [row.id, row]));
const COMMON_LIMITS = [
  'This is one sampled instant. A daily slider step is not a whole-day judgment or a search for exact rule transitions.',
  'These are optional modern study prompts. The source associations and index points do not establish that an activity will succeed.',
  'Calendar labels, observance dates and religious traditions contribute no task score. There is no universal auspiciousness measure.',
];
const westernRequirements = [
  'An explicit local date, clock, observer, IANA time zone and fold policy resolving to one supported UTC instant.',
  'Canonical Moon–Sun elongation and solar separation, Moon daily apparent speed and tropical longitude, and Moon–Mars/Saturn applying-aspect evidence.',
  'All six inherited rule contributions with their source labels and fixed total weight of 10; shared lunar inputs are dependencies, not independent evidence.',
];
function implemented(id, label, profileId, summary, sourceNote, optionalAction, calculationRequirements) {
  const profile = profiles.get(profileId);
  return {
    id, label, implementation: 'implemented-editorial-profile', claimType: 'modern-editorial-study', profileId, scope: 'sampled-instant', wholeDayValidity: false, eventOutcomePrediction: false,
    summary, sourceNote, optionalAction, calculationRequirements,
    source: profile.sourceIds.map(sourceId => { const row = rankingSources.get(sourceId); return row.title + ' (' + row.locator + '; ' + row.url + ')'; }).join('; ') + '. Inherited source records; their existing reading-depth and implementation limits apply.',
    method: profile.method, sourceIds: [...profile.sourceIds], limitations: [...COMMON_LIMITS, ...profile.limitations],
  };
}
function unimplemented(id, label, summary, optionalAction, calculationRequirements) {
  return {
    id, label, implementation: 'unimplemented', claimType: 'unavailable-implementation', profileId: null, scope: 'unimplemented', wholeDayValidity: false, eventOutcomePrediction: false,
    summary, sourceNote: 'No dedicated task rule has been implemented or verified here. Existing source passages for lunar phases and Mercury study do not supply this missing method.',
    source: 'Project-authored implementation boundary: docs/2026-10-calendar-timeline-methods.md, Five task cards, three existing editorial profiles. This records an unimplemented method, not a historical timing instruction.',
    optionalAction, calculationRequirements, method: null, sourceIds: [],
    limitations: [...COMMON_LIMITS, 'No score, favorable time, success probability or source authority is inferred for this task.'],
  };
}

export const TIMELINE_STUDY_TASKS = freeze([
  implemented('begin', 'Begin a small project', 'western-increase-study',
    'Compare the existing increase-study profile: increasing lunar light is an editorial preference within a limited inherited rule subset.',
    'Agrippa II.32 associates the Moon with generation, increase and decrease; II.29 requires several conditions together. Lilly I p.115 distinguishes increasing and decreasing light. This beginning prompt and its numerical weights are modern choices.',
    'Write the first sentence or sketch the first step of a small project, whenever practical.',
    [...westernRequirements, 'Waxing light maps to +1 and waning to −1 only for this profile; the original traditional class remains separate.']),
  implemented('finish', 'Finish or simplify', 'western-decrease-study',
    'Compare the existing decrease/completion profile, which reverses the phase preference while retaining the other inherited rules.',
    'Agrippa II.32 supplies a lunar increase/decrease association, not a complete finishing procedure. Lilly I p.115 treats decreasing light as debility; the completion preference is editorial and does not rewrite that table.',
    'Summarize one unfinished note or remove one unnecessary passage from a draft.',
    [...westernRequirements, 'Waning light maps to +1 and waxing to −1 only for this profile; a positive index is not a historical endorsement of completion.']),
  implemented('study', 'Read, write or study', 'mercury-hour-study',
    'Show whether this sample falls in an implemented Mercury temporal hour, as an optional prompt for correspondence or language study.',
    'Agrippa II.43 associates Mercury images with knowledge and eloquence under additional hour and ascendant conditions. Lilly I pp.77–78 associates Mercury with learning and literate professions. Neither passage establishes that studying succeeds more often in a Mercury hour.',
    'Read one cited passage, write a question about it, or proofread a short note.',
    [
      'An explicit local date, clock, observer, IANA time zone and fold policy resolving to one supported UTC instant.',
      'Canonical sunrise/sunset boundaries, weekday sequence, temporal-hour number, ruler, and start/end UTC instants.',
      'The implemented twelve daylight/twelve night divisions; Agrippa II.34 also reports an ascension convention that is not implemented.',
      'Mercury maps to 100 editorial index points; another known traditional ruler maps to 0 and is not adverse. Missing polar solar boundaries produce no score.',
      'Mercury dignity, rising sign, image construction and their claimed efficacy are not evaluated.',
    ]),
  unimplemented('dialogue', 'Prepare for dialogue',
    'A dedicated dialogue-timing method is unimplemented. Learning or Mercury-hour scores cannot stand in for negotiation or treaty outcomes.',
    'Write down each participant’s stated needs, a shared question, and a practical time everyone can attend.',
    [
      'A named, task-specific historical method, checked edition and exact passages would be needed before encoding a traditional dialogue rule.',
      'Its full required measurements, alternatives, missing-data behavior and supported time scope would need an explicit implementation and independent checks.',
      'No present calendar label, planetary hour or study index establishes agreement or treaty success.',
    ]),
  unimplemented('ceremony', 'Plan a ceremony',
    'A dedicated ceremony-timing method is unimplemented. Civil calendar conversion does not establish a community’s ritual timing or religious efficacy.',
    'Confirm the community’s published schedule, chosen convention, accessibility needs and local arrangements.',
    [
      'A named community, observance and calendar convention, with an authoritative schedule or a checked task-specific method, would be needed.',
      'Any local sunset, sunrise, lunar observation, jurisdiction or other boundary rule must be explicitly specified and supported; a civil-midnight label is insufficient.',
      'A calendar conversion or published observance date does not predict a religious event, ritual efficacy or universal favorable time.',
    ]),
]);

const sourceIds = new Set(TIMELINE_STUDY_TASKS.flatMap(row => row.sourceIds));
export const TIMELINE_STUDY_SOURCES = freeze(copy(HORIZON_RANKING_SOURCES.filter(row => sourceIds.has(row.id))));

/** Internal presentation transform of freshly recomputed canonical purposes.
 * Public callers supply moment inputs to the frame engine, never trusted rows. */
export function buildTimelineStudyTasks(purposes, { includeGuidance = true } = {}) {
  if (!Array.isArray(purposes) || purposes.length > HORIZON_PURPOSES.length) throw new TypeError('Supply the bounded canonical purpose results.');
  if (typeof includeGuidance !== 'boolean') throw new TypeError('includeGuidance must be a boolean.');
  const byId = new Map();
  for (const row of purposes) {
    if (!row || !profiles.has(row.id) || byId.has(row.id)) throw new TypeError('Purpose identifiers must be known and unique.');
    byId.set(row.id, row);
  }
  return TIMELINE_STUDY_TASKS.map(definition => {
    const row = copy(definition);
    if (!row.profileId) return { ...row, status: 'unimplemented', reason: 'No dedicated method is implemented for this task.', result: null, score: null };
    const result = includeGuidance ? byId.get(row.profileId) : null;
    const available = result?.rankable === true && Number.isFinite(result.score);
    return { ...row, status: available ? 'available' : 'unavailable',
      reason: !includeGuidance ? 'Study guidance was explicitly disabled.' : !result ? 'Canonical guidance is unavailable for this sample.' : available ? null : 'A required contribution is missing or unresolved; the complete denominator is retained.',
      result: result ? copy(result) : null, score: available ? result.score : null };
  });
}
