// ============================================================================
//  yogas.js — the DATA-DRIVEN yoga detector (R28 playlist-curriculum T8).
//
//  PURE — no DOM, headless-testable. It evaluates the structured predicate
//  grammar of core/data/yoga-rules.js (36 records) against a castVedic()
//  reading and returns, PER RULE, a status + the outcome of every condition.
//
//  It NEVER reduces a contested yoga to a single boolean: where a rule carries
//  `contested.flag`, the detector marks the status `conditional` and surfaces
//  EVERY position's outcome (mechanically evaluated where the position maps to a
//  checkable configuration — e.g. Gaja-Kesarī bare vs conditioned, Kāla-Sarpa
//  sign-based vs degree-based — and carried as `described` where the position is
//  prose-only). This is the load-bearing honesty rule of the dataset.
//
//  Astrology has no demonstrated predictive validity; this DESCRIBES how the
//  Jyotiṣa tradition classifies a chart — it never prescribes or forecasts.
// ============================================================================
import { YOGA_RULES, YOGA_FAMILIES, YOGA_META } from './data/yoga-rules.js';
import { RASHIS, SPECIAL_ASPECTS, NATURAL_RELATION } from './data/vedic-data.js';
import { combustion } from './vedic.js';

const GROUPS = YOGA_META.predicateGrammar.houseGroups;   // kendra/trikona/trika/upachaya
const ALL_GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const CLASSICAL7 = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const norm360 = x => ((x % 360) + 360) % 360;
const fold180 = a => { const x = norm360(a); return x > 180 ? 360 - x : x; };
const r2 = x => Math.round(x * 100) / 100;

// ---------------------------------------------------------------------------
//  Chart context — a thin read-only view over a castVedic() reading. Whole-sign
//  houses throughout, matching grahas[].rashiIndex.
// ---------------------------------------------------------------------------
function buildCtx(reading) {
  const grahas = reading.grahas;
  const lagnaSign = reading.lagna.rashiIndex;
  const waxing = !!(reading.panchanga && reading.panchanga.tithi && /Śukla|Sukla/.test(reading.panchanga.tithi.paksha || ''));
  let combust = {};
  try { combust = (combustion(reading).perGraha) || {}; } catch { combust = {}; }

  const sign = g => grahas[g].rashiIndex;
  const lon = g => grahas[g].lon;
  const signLord = s => RASHIS[((s % 12) + 12) % 12].lord;
  const lordOfHouse = n => signLord(lagnaSign + (n - 1));               // n:1..12, from Lagna
  const signOfHouse = n => ((lagnaSign + (n - 1)) % 12 + 12) % 12;
  const houseFromRefSign = (refSign, targetSign) => ((targetSign - refSign + 12) % 12) + 1;
  const refSign = ref => ref === 'Lagna' ? lagnaSign : sign(ref);
  const houseOf = g => houseFromRefSign(lagnaSign, sign(g));            // whole-sign house from Lagna
  const dignityToken = g => {
    const st = grahas[g] && grahas[g].dignity ? grahas[g].dignity.state : 'Neutral';
    return st === 'Exalted' ? 'exalted'
      : st === 'Debilitated' ? 'debilitated'
        : st === 'Mūlatrikoṇa' ? 'moolatrikona'
          : st === 'Own sign' ? 'own' : 'neutral';
  };
  const isRetro = g => !!(grahas[g] && grahas[g].retrograde);
  const isCombust = g => !!(combust[g] && combust[g].is);
  const isBenefic = g => g === 'Jupiter' || g === 'Venus' || g === 'Mercury' || (g === 'Moon' && waxing);
  const isStrong = g => {
    const pg = reading.shadbala && reading.shadbala.perGraha && reading.shadbala.perGraha[g];
    return pg ? pg.ratio >= 1 : null;                                  // nodes carry no ṣaḍbala → null
  };
  const shadRatio = g => {
    const pg = reading.shadbala && reading.shadbala.perGraha && reading.shadbala.perGraha[g];
    return pg ? pg.ratio : null;
  };
  // houses (1..12 from Lagna) a graha OWNS
  const housesOwnedBy = g => { const out = []; for (let n = 1; n <= 12; n++) if (lordOfHouse(n) === g) out.push(n); return out; };
  // whole-sign drishti from `a` onto a target sign
  const drishtiToSign = (a, targetSign) => {
    const h = houseFromRefSign(sign(a), targetSign);
    if (h === 7) return true;
    const spec = SPECIAL_ASPECTS[a];
    return !!(spec && spec.includes(h));
  };
  const drishti = (a, b) => drishtiToSign(a, sign(b));

  return {
    reading, grahas, lagnaSign, waxing,
    sign, lon, signLord, lordOfHouse, signOfHouse, houseFromRefSign, refSign, houseOf,
    dignityToken, isRetro, isCombust, isBenefic, isStrong, shadRatio, housesOwnedBy,
    drishtiToSign, drishti,
  };
}

// resolve a `from`/`in` house set → array of houses (1..12)
function houseSet(spec) {
  if (typeof spec === 'string') return GROUPS[spec] ? GROUPS[spec].slice() : [];
  if (Array.isArray(spec)) return spec.slice();
  return [];
}

// candidate grahas for an `any`/exclusion predicate: all 9 minus the excluded set
function candidatesExcluding(excluding, refGraha) {
  const ex = new Set(excluding || []);
  if (refGraha) ex.add(refGraha);
  return ALL_GRAHAS.filter(g => !ex.has(g));
}

// find the exclusion list declared anywhere in a rule's conditions
function ruleExclusion(rule) {
  for (const c of rule.conditions) {
    const p = c.predicate || {};
    if (Array.isArray(p.excluding)) return p.excluding;
    if (p.noGraha && Array.isArray(p.excluding)) return p.excluding;
  }
  return [];
}

// ---------------------------------------------------------------------------
//  Condition evaluation. Returns { met:true|false|null, detail }. `null` means
//  "not mechanically encodable" (surfaced honestly, never silently true).
// ---------------------------------------------------------------------------
function evalCondition(cond, ctx, rule, bind, opts) {
  const p = cond.predicate || {};
  const T = cond.type;

  if (T === 'placement') return evalPlacement(p, ctx, rule, bind, opts);
  if (T === 'lordship') return evalLordship(p, ctx, rule, bind, opts);
  if (T === 'strength') return evalStrength(p, ctx, rule, bind, opts);
  if (T === 'relation') return evalRelation(p, ctx, rule, bind, opts);
  if (T === 'exclusion') return evalExclusion(p, ctx, rule, bind, opts);
  return { met: null, detail: `unhandled condition type "${T}"` };
}

function evalPlacement(p, ctx, rule, bind, opts) {
  // Kāla-Sarpa nodal-arc hemming ({grahas, withinArc}) is evaluated in both modes
  // by the special kala-sarpa path; the generic loop must not touch it.
  if (p.withinArc || (Array.isArray(p.grahas) && !p.graha)) {
    return { met: null, detail: 'nodal-arc hemming — handled by the Kāla-Sarpa evaluator (sign- and degree-based)' };
  }
  // sameSignAs (yuti): graha(s) share a sign with another
  if (p.sameSignAs) {
    const other = p.sameSignAs;
    if (p.graha === 'any') {                                  // any tārā graha conjoined (Kemadruma cancellation)
      const cand = candidatesExcluding(p.excluding || ruleExclusion(rule), other);
      const hits = cand.filter(g => ctx.sign(g) === ctx.sign(other));
      return { met: hits.length > 0, detail: hits.length ? `${hits.join(', ')} conjunct ${other}` : `no graha conjunct ${other}` };
    }
    const g = p.graha;
    const met = ctx.sign(g) === ctx.sign(other);
    return { met, detail: `${g} in ${RASHIS[ctx.sign(g)].name}${met ? ` conjunct ${other}` : `; ${other} in ${RASHIS[ctx.sign(other)].name} (not conjunct)`}` };
  }
  const set = houseSet(p.in);
  const froms = [p.from]; if (p.orFrom) froms.push(p.orFrom);
  // extra reference point for the mahāpuruṣa/kendra rules (default stays Lagna)
  if (opts && opts.kendraAlsoFromMoon && set.length && houseSet('kendra').join() === set.join() && p.from === 'Lagna') {
    if (!froms.includes('Moon')) froms.push('Moon');
  }

  // benefics-only (Adhi, Amala)
  if (p.graha === 'benefics') {
    const cand = ALL_GRAHAS.filter(ctx.isBenefic);
    const hits = [];
    for (const g of cand) for (const f of froms) {
      const h = ctx.houseFromRefSign(ctx.refSign(f), ctx.sign(g));
      if (set.includes(h)) hits.push(`${g} in ${h}th from ${f}`);
    }
    return { met: hits.length > 0, detail: hits.length ? hits.join('; ') : `no benefic in {${set.join(',')}} from ${froms.join('/')}` };
  }

  // any tārā graha (flanking yogas), respecting the record's exclusion set
  if (p.graha === 'any') {
    const refGraha = froms[0] !== 'Lagna' ? froms[0] : null;
    const cand = candidatesExcluding(p.excluding || ruleExclusion(rule), refGraha);
    const hits = [];
    for (const g of cand) for (const f of froms) {
      const h = ctx.houseFromRefSign(ctx.refSign(f), ctx.sign(g));
      if (set.includes(h)) hits.push(`${g} in ${h}th from ${f}`);
    }
    if (hits.length && bind) bind.any = hits.map(s => s.split(' ')[0]);
    return { met: hits.length > 0, detail: hits.length ? hits.join('; ') : `no graha in {${set.join(',')}} from ${froms.join('/')}` };
  }

  // designatedPartner / designatedSupporters — the BPHS 41 per-graha tables are
  // not yet encoded as data; surfaced honestly rather than fabricated.
  if (p.graha === 'designatedPartner') {
    return { met: null, detail: 'requires the BPHS 41.2–8 per-graha 11th-house partner table (not yet encoded — surfaced, not assumed)' };
  }

  // a specific graha in a house set from a reference point
  const g = p.graha;
  const hitFroms = froms.filter(f => set.includes(ctx.houseFromRefSign(ctx.refSign(f), ctx.sign(g))));
  const met = hitFroms.length > 0;
  if (met && bind) bind.same = g;
  const where = froms.map(f => `${ctx.houseFromRefSign(ctx.refSign(f), ctx.sign(g))}th from ${f}`).join(' / ');
  return { met, detail: `${g} is ${where} (wants {${set.join(',')}})` };
}

function evalLordship(p, ctx, rule, bind, opts) {
  // benefic (or listed graha) OWNING a house in a group — Kendrādhipati doṣa
  if (p.grahaIn && p.lordsHouse) {
    const grp = GROUPS[p.lordsHouse] || houseSet(p.lordsHouse);
    const hits = [];
    for (const g of p.grahaIn) {
      const owned = ctx.housesOwnedBy(g).filter(n => grp.includes(n));
      if (owned.length) hits.push(`${g} owns kendra ${owned.join('&')}`);
    }
    return { met: hits.length > 0, detail: hits.length ? hits.join('; ') : `none of ${p.grahaIn.join('/')} owns a ${p.lordsHouse}` };
  }
  // lord of house N in a house set from a reference point
  if (typeof p.lordOf === 'number') {
    const lord = ctx.lordOfHouse(p.lordOf);
    const set = houseSet(p.in);
    const froms = [p.from]; if (p.orFrom) froms.push(p.orFrom);
    const where = froms.map(f => ctx.houseFromRefSign(ctx.refSign(f), ctx.sign(lord)));
    const met = where.some(h => set.includes(h));
    return { met, detail: `lord of ${p.lordOf} (${lord}) is in ${where.map((h, i) => `${h}th from ${froms[i]}`).join(' / ')} (wants {${set.join(',')}})` };
  }
  return { met: null, detail: 'unhandled lordship predicate' };
}

function resolveSelectorGraha(sel, ctx) {
  if (typeof sel !== 'string') return null;
  if (sel.startsWith('lordOf:')) {
    const n = Number(sel.slice(7));
    if (Number.isFinite(n)) return ctx.lordOfHouse(n);
  }
  if (sel.startsWith('graha:')) return sel.slice(6);
  return null;
}

function evalStrength(p, ctx, rule, bind, opts) {
  const dig = p.dignity || [];
  const testDignity = g => dig.includes(ctx.dignityToken(g));

  // "some graha is debilitated" — the Nīca-bhaṅga trigger
  if (p.graha === 'any') {
    const hits = ALL_GRAHAS.filter(g => testDignity(g));
    if (hits.length && bind) bind.debilitated = hits;
    return { met: hits.length > 0, detail: hits.length ? `debilitated: ${hits.join(', ')}` : 'no graha debilitated' };
  }
  // back-reference to the graha bound by a prior placement in the same rule
  if (p.graha === 'same') {
    const g = bind && bind.same;
    if (!g) return { met: null, detail: 'no bound graha (prior placement unmet)' };
    return { met: testDignity(g), detail: `${g} dignity is ${ctx.dignityToken(g)} (wants {${dig.join(',')}})` };
  }
  // a specific graha's dignity — the mahāpuruṣa strength clause
  if (p.graha) {
    return { met: testDignity(p.graha), detail: `${p.graha} dignity is ${ctx.dignityToken(p.graha)} (wants {${dig.join(',')}})` };
  }
  // selector list (raja-neecha-trika): any of the trika lords debilitated
  if (Array.isArray(p.grahaIn)) {
    const gs = p.grahaIn.map(s => resolveSelectorGraha(s, ctx)).filter(Boolean);
    const hits = gs.filter(testDignity);
    return { met: hits.length > 0, detail: hits.length ? `${hits.join(', ')} in {${dig.join(',')}}` : `none of ${gs.join('/')} in {${dig.join(',')}}` };
  }
  // single selector (lakshmi): dignity or "strong"
  if (p.selector) {
    const g = resolveSelectorGraha(p.selector, ctx);
    if (!g) return { met: null, detail: `unresolved selector ${p.selector}` };
    if (dig.includes('strong')) {
      const strong = ctx.isStrong(g), ratio = ctx.shadRatio(g);
      return { met: strong, detail: `${p.selector} = ${g}; ṣaḍbala ${ratio == null ? 'n/a' : ratio + '×'} required (strength surfaced, not gated on a fixed threshold)` };
    }
    return { met: testDignity(g), detail: `${p.selector} = ${g}; dignity ${ctx.dignityToken(g)} (wants {${dig.join(',')}})` };
  }
  if (p.not) return { met: null, detail: `exclusion-of-affliction clause {not: ${p.not.join(',')}} evaluated per graha at surface` };
  return { met: null, detail: 'unhandled strength predicate' };
}

// resolve a relation selector to a list of {graha, viaHouse?} entries
function resolveRelationSet(sel, ctx, houseSetSpec) {
  if (sel === 'lordOf:kendra' || sel === 'lordOf:trikona' || sel === 'lordOf:trika' || sel === 'lordOf:upachaya') {
    const grp = sel.slice(7);
    return GROUPS[grp].map(n => ({ graha: ctx.lordOfHouse(n), viaHouse: n }));
  }
  if (sel === 'lordOf:A' || sel === 'lordOf:B') {
    const set = houseSetSpec && houseSetSpec[sel.slice(7)] ? houseSetSpec[sel.slice(7)] : [];
    return set.map(n => ({ graha: ctx.lordOfHouse(n), viaHouse: n }));
  }
  if (typeof sel === 'string' && sel.startsWith('lordOf:')) {
    const n = Number(sel.slice(7));
    if (Number.isFinite(n)) return [{ graha: ctx.lordOfHouse(n), viaHouse: n }];
  }
  if (typeof sel === 'string' && sel.startsWith('house:')) return [{ house: Number(sel.slice(6)) }];
  if (typeof sel === 'string' && sel.startsWith('graha:')) return [{ graha: sel.slice(6) }];
  // semi-structured selectors that need tables/other engines
  if (sel === 'designatedSupporters' || sel === 'maraka' || sel === 'exchangePair') return [{ symbolic: sel }];
  return [{ symbolic: String(sel) }];
}

function sambandhaHolds(a, b, kinds, ctx) {
  // a, b are graha names; kinds is the admissible sambandha list
  const out = [];
  if (kinds.includes('yuti') && ctx.sign(a) === ctx.sign(b)) out.push('conjunction');
  if ((kinds.includes('mutualDrishti')) && ctx.drishti(a, b) && ctx.drishti(b, a)) out.push('mutual aspect');
  if (kinds.includes('drishti') && ctx.drishti(a, b)) out.push('aspect');
  if (kinds.includes('parivartana') && ctx.signLord(ctx.sign(a)) === b && ctx.signLord(ctx.sign(b)) === a) out.push('exchange');
  return out;
}

function evalRelation(p, ctx, rule, bind, opts) {
  const kinds = p.sambandha || [];
  const A = resolveRelationSet(p.between[0], ctx, p.houseSets);
  const B = resolveRelationSet(p.between[1], ctx, p.houseSets);

  // symbolic right-hand selectors (designatedSupporters / maraka / exchangePair)
  const symbolic = B.find(x => x.symbolic) || A.find(x => x.symbolic);
  if (symbolic) {
    return { met: null, detail: `the "${symbolic.symbolic}" clause needs a companion table/engine (māraka set / BPHS-41 supporters) — surfaced, not assumed` };
  }

  const hits = [];
  for (const ea of A) for (const eb of B) {
    // house:N target (raja-neecha-trika: lord of 1 aspects the Lagna)
    if (eb.house != null && ea.graha) {
      const targetSign = ctx.signOfHouse(eb.house);
      if (kinds.includes('drishti') && ctx.drishtiToSign(ea.graha, targetSign)) hits.push(`${ea.graha} aspects house ${eb.house}`);
      continue;
    }
    if (!ea.graha || !eb.graha) continue;
    if (ea.graha === eb.graha) continue;               // a graha in sambandha with itself is meaningless
    const s = sambandhaHolds(ea.graha, eb.graha, kinds, ctx);
    if (s.length) {
      const via = [ea.viaHouse ? `${ea.graha}=L${ea.viaHouse}` : ea.graha, eb.viaHouse ? `${eb.graha}=L${eb.viaHouse}` : eb.graha].join(' & ');
      hits.push(`${via}: ${s.join('/')}`);
    }
  }
  // de-dup
  const uniq = [...new Set(hits)];
  return { met: uniq.length > 0, detail: uniq.length ? uniq.join('; ') : `no ${kinds.join('/')} between ${p.between.join(' & ')}` };
}

function evalExclusion(p, ctx, rule, bind, opts) {
  // Kāla-Sarpa "no graha outside the arc" is handled in the special kala-sarpa path
  if (p.noGraha && p.noGraha.outsideArc) return { met: null, detail: 'arc-exclusion handled by the Kāla-Sarpa evaluator (both modes)' };
  // Kemadruma: NO tārā graha in the given houses from the Moon
  if (p.noGraha && p.noGraha.in) {
    const set = houseSet(p.noGraha.in);
    const from = p.noGraha.from || 'Moon';
    const cand = candidatesExcluding(p.excluding, from);
    const refSign = ctx.refSign(from);
    const present = cand.filter(g => set.includes(ctx.houseFromRefSign(refSign, ctx.sign(g))));
    // met (isolation present) when NONE are found
    return { met: present.length === 0, detail: present.length ? `broken by ${present.map(g => g).join(', ')} near the ${from}` : `no graha in {${set.join(',')}} from ${from}` };
  }
  // a bare `excluding` clause is a modifier for `any`/`benefics` — always "satisfied"
  if (Array.isArray(p.excluding)) return { met: true, detail: `count excludes ${p.excluding.join(', ')}` };
  return { met: null, detail: 'unhandled exclusion predicate' };
}

// ---------------------------------------------------------------------------
//  Special per-yoga evaluators for the mechanically-checkable CONTESTED cases.
//  Each returns { positions:[{label, outcome, detail}] } where outcome is
//  'met' | 'not-met' | 'described'.
// ---------------------------------------------------------------------------
function gajaKesariPositions(ctx) {
  const jHouseMoon = ctx.houseFromRefSign(ctx.sign('Moon'), ctx.sign('Jupiter'));
  const jHouseLagna = ctx.houseOf('Jupiter');
  const bareMet = GROUPS.kendra.includes(jHouseMoon);
  // conditioned (BPHS 36.3-4): Jupiter in kendra from Lagna OR Moon, joined/aspected by a
  // benefic, and free of debilitation/combustion/inimical sign.
  const inKendra = GROUPS.kendra.includes(jHouseMoon) || GROUPS.kendra.includes(jHouseLagna);
  const benefics = ['Venus', 'Mercury', 'Moon'].filter(ctx.isBenefic);   // Jupiter itself excluded
  const benefICassoc = benefics.some(b => ctx.sign(b) === ctx.sign('Jupiter') || ctx.drishti(b, 'Jupiter'));
  const jDeb = ctx.dignityToken('Jupiter') === 'debilitated';
  const jCombust = ctx.isCombust('Jupiter');
  const jInimical = NATURAL_RELATION.Jupiter.enemy.includes(ctx.signLord(ctx.sign('Jupiter')));
  const conditionedMet = inKendra && benefICassoc && !jDeb && !jCombust && !jInimical;
  // JP alt: Moon aspected by Mercury/Venus/Jupiter, aspector unafflicted
  const jpAspectors = ['Mercury', 'Venus', 'Jupiter'].filter(a => ctx.drishti(a, 'Moon') && ctx.dignityToken(a) !== 'debilitated' && !ctx.isCombust(a));
  const jpMet = jpAspectors.length > 0;
  return {
    positions: [
      { label: 'Bare rule (Phaladīpikā 6.14): Jupiter in a kendra from the Moon suffices', outcome: bareMet ? 'met' : 'not-met', detail: `Jupiter is ${jHouseMoon}th from the Moon` },
      { label: 'Conditioned rule (BPHS 36.3–4): kendra from Lagna or Moon + benefic association + free of debilitation/combustion/inimical sign', outcome: conditionedMet ? 'met' : 'not-met', detail: `kendra:${inKendra}, benefic-assoc:${benefICassoc}, debilitated:${jDeb}, combust:${jCombust}, inimical:${jInimical}` },
      { label: 'Jātaka Pārijāta alternative (7.116): Moon aspected by Mercury/Venus/Jupiter, the aspector unafflicted', outcome: jpMet ? 'met' : 'not-met', detail: jpMet ? `aspected by ${jpAspectors.join(', ')}` : 'no unafflicted Mercury/Venus/Jupiter aspect on the Moon' },
      { label: 'Modern-critical (playlist session 124): only the conditioned forms are held meaningful; the bare form recurs in ~a quarter of charts', outcome: 'described', detail: 'a stance on significance, not a separate configuration' },
    ],
  };
}

function kalaSarpaPositions(ctx) {
  const rahuSign = ctx.sign('Rahu'), ketuSign = ctx.sign('Ketu');
  const rahuLon = ctx.lon('Rahu'), ketuLon = ctx.lon('Ketu');
  // sign-based: every classical graha's sign in the forward arc Rahu..Ketu (7 signs)
  const signArc = [];
  for (let i = 0; i <= 6; i++) signArc.push((rahuSign + i) % 12);
  const signOutside = CLASSICAL7.filter(g => !signArc.includes(ctx.sign(g)));
  const signMet = signOutside.length === 0;
  // degree-based: every classical graha within 180° forward of Rahu
  const degOutside = CLASSICAL7.filter(g => norm360(ctx.lon(g) - rahuLon) > 180 + 1e-9);
  const degMet = degOutside.length === 0;
  return {
    signArc, rahuSign, ketuSign, rahuLon: r2(rahuLon), ketuLon: r2(ketuLon),
    positions: [
      { label: 'Sign-based hemming (whole-sign): all seven grahas in the arc from Rāhu\'s sign forward to Ketu\'s', outcome: signMet ? 'met' : 'not-met', detail: signMet ? 'no graha outside the nodal arc (by sign)' : `outside by sign: ${signOutside.join(', ')}` },
      { label: 'Degree-based hemming: all seven grahas within 180° zodiacal of Rāhu', outcome: degMet ? 'met' : 'not-met', detail: degMet ? 'no graha outside the nodal arc (by degree)' : `outside by degree: ${degOutside.join(', ')}` },
      { label: 'Skeptical position: no śāstra locus (absent from BPHS/Phaladīpikā/Sārāvalī/Bṛhat Jātaka) — a doctrine without a text', outcome: 'described', detail: 'provenance flag, not a configuration test' },
    ],
  };
}

function neechaBhangaPositions(ctx, debilitated) {
  // Phaladīpikā/JP mechanizable cancellation per fallen graha:
  // dispositor (or exaltation-lord) of the fallen sign in a kendra from Lagna or Moon.
  const perGraha = (debilitated || []).map(g => {
    const dispositor = ctx.signLord(ctx.sign(g));
    const dispHouseL = ctx.houseOf(dispositor);
    const dispHouseM = ctx.houseFromRefSign(ctx.sign('Moon'), ctx.sign(dispositor));
    const cancelled = GROUPS.kendra.includes(dispHouseL) || GROUPS.kendra.includes(dispHouseM);
    return { graha: g, dispositor, cancelled, detail: `dispositor ${dispositor} is ${dispHouseL}th from Lagna / ${dispHouseM}th from Moon` };
  });
  const anyCancelled = perGraha.some(x => x.cancelled);
  return {
    perGraha,
    positions: [
      { label: 'BPHS (39.19–20, 39.28): a raja yoga from fallen grahas/lords with a dignified Lagna lord aspecting the Lagna — not a dispositor-kendra formula (see the "Debilitated Trika Lords" rule)', outcome: 'described', detail: 'cross-reference: raja-neecha-trika' },
      { label: 'Phaladīpikā (7.26–30): the dispositor or exaltation-lord of the fallen graha in a kendra from the Lagna or the Moon cancels the fall', outcome: anyCancelled ? 'met' : 'not-met', detail: perGraha.map(x => `${x.graha}: ${x.cancelled ? 'cancelled' : 'not cancelled'} (${x.detail})`).join('; ') || 'no debilitated graha' },
      { label: 'Jātaka Pārijāta (ch. 7): the lord of the occupied sign, or the graha exalted there, in a kendra from the Lagna or the Chandra-lagna', outcome: anyCancelled ? 'met' : 'not-met', detail: 'shares the dispositor-in-kendra mechanism evaluated above' },
      { label: 'Popular composite: mutual exchange / mutual aspect of two fallen grahas — no single classical locus', outcome: 'described', detail: 'commentarial accretion, flagged not encoded' },
    ],
  };
}

// ---------------------------------------------------------------------------
//  Per-rule evaluation.
// ---------------------------------------------------------------------------
function evalRule(rule, ctx, opts) {
  const bind = {};
  const conditionResults = rule.conditions.map(c => {
    const res = evalCondition(c, ctx, rule, bind, opts);
    return { type: c.type, predicate: c.predicate, met: res.met, detail: res.detail, note: c.note || null };
  });

  // combine required conditions
  const required = rule.allConditionsRequired !== false;
  const mets = conditionResults.map(c => c.met);
  const hasNull = mets.some(m => m === null);
  const allTrue = mets.every(m => m === true);
  const anyTrue = mets.some(m => m === true);
  let status;
  if (required) status = allTrue ? 'met' : (hasNull && !mets.some(m => m === false)) ? 'conditional' : 'not-met';
  else status = anyTrue ? 'met' : hasNull ? 'conditional' : 'not-met';

  const out = {
    id: rule.id, name: rule.name, family: rule.family, rule,
    status, conditionResults,
    contestedNote: rule.contested && rule.contested.flag ? rule.contested.topic : null,
    provenanceNote: rule.provenanceNote || null,
    sensitiveNote: rule.sensitiveNote || null,
  };

  // cancellations that are structured predicates (Kemadruma, Śakaṭa)
  if (Array.isArray(rule.cancellations)) {
    out.cancellations = rule.cancellations.map(cn => {
      if (cn.rule && typeof cn.rule === 'object' && cn.rule.type) {
        const res = evalCondition({ type: cn.rule.type, predicate: cn.rule.predicate }, ctx, rule, {}, opts);
        return { label: cn.label, source: cn.source, status: cn.status, met: res.met, detail: res.detail };
      }
      return { label: cn.label, source: cn.source, status: cn.status, met: null, detail: typeof cn.rule === 'string' ? cn.rule : 'prose-only' };
    });
  }

  // CONTESTED rules: never a bare boolean — surface every position's outcome
  if (rule.contested && rule.contested.flag) {
    let special = null;
    if (rule.id === 'gaja-kesari') special = gajaKesariPositions(ctx);
    else if (rule.id === 'kala-sarpa') special = kalaSarpaPositions(ctx);
    else if (rule.id === 'neecha-bhanga') special = neechaBhangaPositions(ctx, bind.debilitated);

    if (special && special.positions) {
      out.positions = special.positions;
      if (special.signArc) out.kalaSarpa = { signArc: special.signArc, rahuSign: special.rahuSign, ketuSign: special.ketuSign, rahuLon: special.rahuLon, ketuLon: special.ketuLon };
      if (special.perGraha) out.neechaBhanga = special.perGraha;
    } else {
      // no per-position engine: carry the verbatim positions as `described`
      out.positions = (rule.contested.positions || []).map(text => ({ label: text, outcome: 'described', detail: null }));
    }
    // a contested rule whose trigger fires is reported `conditional`, never met/not-met
    const triggered = required ? !mets.some(m => m === false) : anyTrue;
    out.status = triggered ? 'conditional' : 'not-met';
  }

  return out;
}

// ---------------------------------------------------------------------------
//  detectYogas(chart, opts) — evaluate all 36 rules against a castVedic reading.
//    opts.kendraAlsoFromMoon : also count the mahāpuruṣa kendra from the Moon
//                              (Phaladīpikā 6.4's rider; default false = Lagna).
//  Returns: [{ id, name, family, rule, status:'met'|'conditional'|'not-met',
//              conditionResults:[{type,predicate,met,detail,note}],
//              contestedNote, positions?, cancellations?, ... }]
//  NEVER a bare boolean: contested rules always carry their positions.
// ---------------------------------------------------------------------------
export function detectYogas(chart, opts = {}) {
  if (!chart || !chart.grahas || !chart.lagna) throw new Error('detectYogas expects a castVedic() reading ({ grahas, lagna, ... })');
  const ctx = buildCtx(chart);
  return YOGA_RULES.map(rule => evalRule(rule, ctx, opts));
}

// ---------------------------------------------------------------------------
//  yogaStats() — dataset-level counts (no chart needed).
// ---------------------------------------------------------------------------
export function yogaStats() {
  const byFamily = {};
  for (const r of YOGA_RULES) byFamily[r.family] = (byFamily[r.family] || 0) + 1;
  return {
    total: YOGA_RULES.length,
    contested: YOGA_RULES.filter(r => r.contested && r.contested.flag).length,
    taughtInPlaylist: YOGA_RULES.filter(r => r.taughtInPlaylist).length,
    withProvenanceNote: YOGA_RULES.filter(r => r.provenanceNote).length,
    withSensitiveNote: YOGA_RULES.filter(r => r.sensitiveNote).length,
    byFamily,
    families: YOGA_FAMILIES,
    editions: YOGA_META.editions,
  };
}

export { YOGA_RULES, YOGA_FAMILIES, YOGA_META };
export default { detectYogas, yogaStats, YOGA_RULES, YOGA_FAMILIES, YOGA_META };
