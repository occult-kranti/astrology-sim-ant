// Authored execution inventory joined to the generated actual MCP schemas.
// Presence in the catalogue does not authorize or imply execution in a date scan.
import { MCP_TOOL_CONTRACTS } from './mcp-tool-contracts.js';
import { REGISTRY } from '../registry.js';

const definitions = {};
const add = (names, category, note, extra = {}) => names.forEach(name => {
  if (definitions[name]) throw new Error('Duplicate horizon tool coverage: ' + name);
  definitions[name] = { category, note, pipelineExecuted: false, adapterInvoked: false, ...extra };
});
add(['workbench_compare_moment'], 'pipeline-engine', 'The canonical compareMoment engine is executed for every available case/date sample; its public MCP transport is not invoked.', { pipelineExecuted: true, executedExports: ['calendar-observatory.js:compareMoment'] });
add(['workbench_explain_guidance'], 'pipeline-engine', 'The canonical buildDayGuidance engine is executed for every available sample; only declared profile rules contribute to ranking.', { pipelineExecuted: true, executedExports: ['day-guidance.js:buildDayGuidance'] });
add(['workbench_calc_positions'], 'pipeline-engine-subset', 'castChart is reused to compute the explicit moment. The pipeline retains selected comparison/guidance fields, not the complete MCP adapter envelope.', { pipelineExecuted: true, executedExports: ['astro.js:castChart'] });
add(['workbench_calc_planetary_hours'], 'pipeline-engine-subset', 'The same planetaryHour engine supplies temporal-hour boundaries/rulers; polar missingness is retained.', { pipelineExecuted: true, executedExports: ['planetary-hours.js:planetaryHour'] });
add(['workbench_calendar'], 'pipeline-engine-subset', 'calendarAtInstant supplies its supported civil rows inside the wider thirteen-row comparison. No civil label supplies a score.', { pipelineExecuted: true, executedExports: ['cultural-calendars.js:calendarAtInstant'] });
add(['workbench_prayer_times'], 'pipeline-engine-subset', 'The canonical timetable function runs inside compareMoment. Its output is informational and never ranked as good or bad.', { pipelineExecuted: true, executedExports: ['cultural-calendars.js:prayerTimes'] });
add(['workbench_qibla'], 'pipeline-engine-subset', 'The canonical direction function runs inside compareMoment. Its output is informational and never ranked as good or bad.', { pipelineExecuted: true, executedExports: ['cultural-calendars.js:qibla'] });
add(['workbench_chart'], 'pipeline-engine-subset', 'Shared castChart/castVedic/planetaryHour engines run; this does not execute the entire chart wrapper or optional birth branches.', { pipelineExecuted: true, executedExports: ['astro.js:castChart', 'vedic.js:castVedic', 'planetary-hours.js:planetaryHour'] });
add(['workbench_muhurta'], 'pipeline-engine-subset', 'Only the inherited panchangaScreens classification helper is reused by comparison/guidance. The full muhūrta result, timeline and other conventions are not executed.', { pipelineExecuted: true, executedExports: ['muhurta.js:panchangaScreens'] });
add(['workbench_calc_era_legis', 'workbench_calc_liber_resh_stations', 'workbench_calc_yoga_detector', 'workbench_jung', 'workbench_behenian_stars', 'workbench_vedic_graha_bala', 'workbench_sky_snapshot', 'workbench_calendar_alignment', 'workbench_sky_interpretation', 'workbench_full_reading', 'workbench_calendar_atlas', 'workbench_handcalc'], 'date-capable-not-executed', 'A bounded explicit-moment calculation is possible under this tool’s own schema and conventions. It is not an additional rule vote or executed engine in the default horizon pipeline; optional personal/partner branches are not inferred.');
add(['workbench_calc_essential_dignity', 'workbench_calc_almuten', 'workbench_calc_lunar_mansions', 'workbench_calc_decan_faces', 'workbench_kp'], 'requires-explicit-method-or-target', 'The wrapper requires a chosen planet/degree, horary mode/number or an explicit derived coordinate. A raw civil date is not this input contract; no choice is silently invented.');
add(['workbench_calc_election', 'workbench_calc_talisman', 'workbench_shatkarman'], 'requires-explicit-method-or-target', 'Requires a named operation or act. Its complete historical rule system and task choices are not substituted by the four horizon study profiles.');
add(['workbench_calc_profections', 'workbench_calc_life_trajectory', 'workbench_transits', 'workbench_synastry', 'workbench_returns', 'workbench_secondary_progressions', 'workbench_firdaria', 'workbench_zodiacal_releasing', 'workbench_directions', 'workbench_solar_return', 'workbench_rectification', 'workbench_tajika', 'workbench_tithi_pravesha', 'workbench_kuta'], 'requires-personal-context', 'Requires an explicit birth/radix, age, paired people or personal reference context. A future sampled day cannot be substituted as somebody’s birth; nothing is loaded from saved records.');
add(['workbench_natal_topics'], 'requires-personal-context', 'The adapter mechanically accepts a known chart moment, but interpreting the twelve-topic ledger as a nativity requires deliberately supplied birth context. The horizon does not fabricate a person for each future date.');
add(['workbench_horary_judgement', 'workbench_prasna'], 'requires-question-context', 'Requires an explicitly chosen question/significator context to use as horary or praśna. The actual schema may supply a default house, but the horizon does not invent a question for every sampled date.');
add(['workbench_geomancy', 'workbench_tarot', 'workbench_iching', 'workbench_runes'], 'requires-explicit-draw', 'Requires explicit tallies, card draws, line throws or rune indices. A date does not generate an oracle draw; no randomness is manufactured to fill the horizon.');
add(['workbench_calc_confluence_atlas', 'workbench_calc_bhava_phala', 'workbench_calc_comparison', 'workbench_source_lookup', 'workbench_printed_chart', 'workbench_tool_guide', 'workbench_source_search', 'workbench_catalogue'], 'source-reference-or-reconstruction', 'Reference, source retrieval, correspondence lookup, historical graph or an allowlisted printed-chart reconstruction. It is not a future date prediction engine.');
add(['workbench_symbol', 'workbench_gematria', 'workbench_katapayadi', 'workbench_sigil_design'], 'requires-text-or-design-choice', 'Requires explicitly chosen text, geometry, planet, seed or design method. Deterministic design is not an astronomical date-quality rule.');
add(['workbench_cycles', 'workbench_sky_timeline', 'workbench_calendar_search', 'workbench_calendar_outlook', 'workbench_moments', 'workbench_election'], 'separate-bounded-scan', 'A separate bounded range scanner exists, with its own sample grid, target/rule choices and output limits. The horizon does not recursively call every scanner or infer that their results are independent.');
add(['workbench_world_events'], 'curated-event-catalogue', 'Reads the explicitly dated curated agenda. Changing a date does not refresh source facts, discover future world events, infer event clocks or supply an outcome score.');
add(['workbench_calendar_timeline_frame'], 'date-capable-not-executed', 'Recomputes one explicit slider-selected moment through canonical chart/calendar/sky engines. The complete horizon does not execute this wrapper or add its repeated source rules as independent evidence.');
add(['workbench_country_history'], 'source-reference-or-reconstruction', 'Reads only curated past historical markers and explicitly assumed historical civil-day geometry. It accepts no future date or objective and contributes no profile score to the horizon.');
add(['workbench_julian_day'], 'date-conversion-not-executed', 'The separate Julian-Day converter supports explicit civil conventions. The comparison obtains JD directly from its canonical astronomy context instead of invoking this wrapper.');
add(['workbench_easter'], 'pipeline-engine', 'horizon-observances reuses canonical named Gregorian/Julian computus with a per-year cache. Ecclesiastical computus is not an observed lunar phase or a favorable-day rule.', { pipelineExecuted: true, executedExports: ['cultural-calendars.js:easter'], executionFrequency: 'Once per requested year/convention, cached; not every case/date.' });
add(['workbench_horizon_scan'], 'pipeline-engine', 'This bounded MCP entrypoint reuses buildEventHorizon. The browser calls the canonical engine directly for its separately declared full-range scan.', { pipelineExecuted: true, executedExports: ['event-horizon.js:buildEventHorizon'] });
add(['workbench_horizon_day'], 'on-demand-horizon-detail', 'Recomputes one explicitly selected day and optional hourly guidance. Detail helpers are called on demand, not for every row of the default horizon scan.', { executedExports: ['event-horizon.js:getHorizonDayDetail', 'event-horizon.js:getHorizonHourlyDetail'] });

export const HORIZON_TOOL_COVERAGE = Object.entries(MCP_TOOL_CONTRACTS).map(([name, inputSchema]) => ({
  name,
  ...(definitions[name] || { category: 'not-reviewed', note: 'New registered tool has no reviewed horizon batchability assignment yet.', pipelineExecuted: false, adapterInvoked: false }),
  requiredInputs: [...inputSchema.required], availableInputFields: Object.keys(inputSchema.properties),
  inputContract: 'Use the actual named MCP schema. Required field names alone do not encode conditional mode requirements or method-specific semantic validation.',
}));

const NON_CALCULATION_CAPABILITIES = ['chronology-timeline', 'yoga-sutras', 'buddhist-canon', 'practices', 'practitioners-library', 'great-works', 'great-works-east', 'viz-scale', 'timeline-svg', 'vedic-chart', 'viz-score-bar', 'viz-heat-table', 'viz-wheel-model', 'explain-workbench', 'explain-horary', 'explain-nativity', 'explain-narrate', 'opgraph', 'standards-lab'];
export const HORIZON_REFERENCE_CAPABILITY_COVERAGE = NON_CALCULATION_CAPABILITIES.map(id => {
  const entry = REGISTRY.find(row => row.id === id);
  if (!entry) throw new Error('Missing declared reference/rendering capability: ' + id);
  return { id, title: entry.title, pages: [...entry.pages], category: 'reference-or-renderer', pipelineExecuted: false, note: 'Historical/source content, rendering/layout primitive, attributed explanation or standards demonstration; no additional date-quality measurement is invented.' };
});

export function horizonCoverageSummary() {
  const categories = {};
  for (const row of HORIZON_TOOL_COVERAGE) categories[row.category] = (categories[row.category] || 0) + 1;
  return { registeredMCPTools: HORIZON_TOOL_COVERAGE.length, pipelineEngineMappings: HORIZON_TOOL_COVERAGE.filter(row => row.pipelineExecuted).length,
    mcpAdaptersInvokedByScan: 0, referenceOrRendererCapabilities: HORIZON_REFERENCE_CAPABILITY_COVERAGE.length,
    reviewed: HORIZON_TOOL_COVERAGE.every(row => row.category !== 'not-reviewed'), categories,
    limitation: 'Mappings identify shared canonical engines or the exact documented subset. They do not claim that every registered tool or every function option is executed by this horizon.' };
}
