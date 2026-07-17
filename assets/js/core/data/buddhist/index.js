// ============================================================================
//  core/data/buddhist/index.js  —  MOSTLY GENERATED (the R30 three texts by
//  node r30build/gen-buddhist.cjs); the R31 Dhammapada entry is a minimal,
//  reviewed hand-edit (B-BUDDHIST-DHP) — its data lives in the generated
//  dhammapada.js (node r31build/gen-dhammapada.cjs).
//
//  The Buddhist wing data barrel: re-exports each text's records/refrains and
//  builds BUDDHIST_TEXTS (per-text metadata; `segments` and `words` computed LIVE from
//  the records so the counts can never drift). Consumed by core/buddhist.js. DOM-free.
// ============================================================================

import { METTA_META, METTA_RECORDS } from './metta.js';
import { HEART_META, HEART_RECORDS } from './heart.js';
import { MN118_META, MN118_RECORDS, MN118_REFRAINS, MN118_SUBSTITUTION_GLOSSES } from './mn118.js';
import { DHAMMAPADA_META, DHAMMAPADA_RECORDS } from './dhammapada.js';

export { METTA_META, METTA_RECORDS, HEART_META, HEART_RECORDS, MN118_META, MN118_RECORDS, MN118_REFRAINS, MN118_SUBSTITUTION_GLOSSES, DHAMMAPADA_META, DHAMMAPADA_RECORDS };

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
  {
    id: 'dhammapada',
    title: 'The Dhammapada (vaggas 1–5)',
    titleOriginal: 'Dhammapada',
    lang: 'pi',
    tradition: 'Theravāda — Pāli Canon (Khuddaka Nikāya; Dhp 1–75)',
    translationSource: 'Bhikkhu Sujato, Sayings of the Dhamma (SuttaCentral, 2018–; CC0)',
    licence: { root: 'cc0', translation: 'cc0', glosses: 'original' },
    segments: DHAMMAPADA_RECORDS.length,
    words: wordCount(DHAMMAPADA_RECORDS),
    // Vaggas 1–5 of the traditional 26 are glossed word-by-word; the rest is
    // catalogued (index.html). Famous cruxes live in per-record `notes` (like
    // metta/mn118), so no structured `contested` blocks here.
    contested: [],
    meta: DHAMMAPADA_META,
  },
];
