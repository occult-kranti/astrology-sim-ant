// ============================================================================
//  core/data/buddhist/index.js  —  GENERATED, DO NOT HAND-EDIT.
//  Regenerate: node r30build/gen-buddhist.cjs (reads r29data/*.json verbatim).
//
//  The Buddhist wing data barrel: re-exports the three texts' records/refrains and
//  builds BUDDHIST_TEXTS (per-text metadata; `segments` and `words` computed LIVE from
//  the records so the counts can never drift). Consumed by core/buddhist.js. DOM-free.
// ============================================================================

import { METTA_META, METTA_RECORDS } from './metta.js';
import { HEART_META, HEART_RECORDS } from './heart.js';
import { MN118_META, MN118_RECORDS, MN118_REFRAINS, MN118_SUBSTITUTION_GLOSSES } from './mn118.js';

export { METTA_META, METTA_RECORDS, HEART_META, HEART_RECORDS, MN118_META, MN118_RECORDS, MN118_REFRAINS, MN118_SUBSTITUTION_GLOSSES };

// Live word-gloss count over a record set (refrain-use records carry no words[]).
const wordCount = recs => recs.reduce((n, r) => n + (r.words ? r.words.length : 0), 0);

// Per-text metadata. Display strings (title/tradition/…) are authored here; the
// canonical text lives verbatim in the record modules. `contested` is the
// structured both-ways ledger (heart only carries structured blocks; metta &
// mn118 keep their cruxes in per-record `notes`). licence: per-layer tag classes
// (plan §1.11 — {cc0, pd-age, original}).
export const BUDDHIST_TEXTS = [
  {
    id: 'metta',
    title: 'The Metta Sutta (Karaṇīyametta Sutta)',
    titleOriginal: 'Karaṇīyamettasutta',
    lang: 'pi',
    tradition: 'Theravāda — Pāli Canon (Suttanipāta 1.8 = Khuddakapāṭha 9)',
    translationSource: 'Bhikkhu Sujato, Anthology of Discourses (SuttaCentral, 2021/2023; CC0)',
    licence: { root: 'cc0', translation: 'cc0', glosses: 'original' },
    segments: METTA_RECORDS.length,
    words: wordCount(METTA_RECORDS),
    contested: [],
    meta: METTA_META,
  },
  {
    id: 'heart',
    title: 'The Heart Sūtra (shorter recension)',
    titleOriginal: 'Prajñāpāramitāhṛdaya',
    lang: 'sa',
    tradition: 'Mahāyāna — Prajñāpāramitā',
    translationSource: 'F. Max Müller, SBE 49 (1894; PD)',
    licence: { root: 'pd-age', translation: 'pd-age', glosses: 'original' },
    segments: HEART_RECORDS.length,
    words: wordCount(HEART_RECORDS),
    contested: HEART_META.contested,
    meta: HEART_META,
  },
  {
    id: 'mn118',
    title: 'The Ānāpānassati Sutta (Mindfulness of Breathing)',
    titleOriginal: 'Ānāpānassati Sutta',
    lang: 'pi',
    tradition: 'Theravāda — Pāli Canon (Majjhima Nikāya 118)',
    translationSource: 'Bhikkhu Sujato, The Middle Discourses (SuttaCentral, 2018–; CC0)',
    licence: { root: 'cc0', translation: 'cc0', glosses: 'original' },
    segments: MN118_RECORDS.length,
    words: wordCount(MN118_RECORDS),
    refrains: MN118_REFRAINS.length,
    refrainUseRecords: MN118_RECORDS.filter(r => r.kind === 'refrain-use').length,
    fullRecords: MN118_RECORDS.filter(r => r.kind === 'full').length,
    contested: [],
    meta: MN118_META,
  },
];
