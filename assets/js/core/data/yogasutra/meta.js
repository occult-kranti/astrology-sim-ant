// ============================================================================
//  meta.js — Metadata for the Pātañjala Yoga-sūtra module: the four pādas,
//  their sūtra counts across editions, the sources used, and a dating note.
//
//  The total number of sūtras is edition-dependent. The chief fault-lines are
//  (a) whether III.22 (on the two kinds of karma / aparānta-jñāna) is counted
//  as a separate sūtra, and (b) whether Kaivalya-pāda has 34 (vulgate) or 33
//  (Bhoja) sūtras. This module's pada1.js follows the 51-sūtra Samādhi-pāda
//  shared by every tradition.
// ============================================================================

export const YS_META = {
  // The four books (pādas). `count` is fixed where undisputed; `counts` records
  // the edition-dependent totals.
  padas: [
    { num: 1, name: 'Samādhi-pāda',  sanskrit: 'समाधिपाद',  count: 51 },
    { num: 2, name: 'Sādhana-pāda',  sanskrit: 'साधनपाद',   count: 55 },
    { num: 3, name: 'Vibhūti-pāda',  sanskrit: 'विभूतिपाद',  counts: { with322: 56, without322: 55 } },
    { num: 4, name: 'Kaivalya-pāda', sanskrit: 'कैवल्यपाद',  counts: { vulgate: 34, bhoja: 33 } }
  ],

  // Total-count traditions. `detail` is the per-pāda breakdown (I/II/III/IV).
  countsByEdition: [
    { total: 196, detail: '51/55/56/34', editions: 'Iyengar, Taimni, Satchidananda (include III.22)' },
    { total: 195, detail: '51/55/55/34', editions: 'Vyāsa-bhāṣya tradition, Krishnamacharya, Āraṇya, sanskritdocuments' },
    { total: 194, detail: '51/55/55/33', editions: "Bhoja's Rājamārtaṇḍa (also omits vulgate IV.16)" }
  ],

  // Public-domain sources this module draws on.
  sources: [
    'Rama Prasada, "Patañjali\'s Yoga Sutras, with the Commentary of Vyāsa and the Gloss of Vāchaspati Miśra" (Sacred Books of the Hindus, Vol. IV), Pāṇini Office, Allahabad, 1912 — word-by-word glosses.',
    'James Haughton Woods, "The Yoga-System of Patañjali" (Harvard Oriental Series, Vol. 17), Harvard University Press, 1914 — whole-sūtra translations (body text).',
    'Swami Vivekananda, "Rāja Yoga," New York, 1896 — translations only (no word-by-word glosses).',
    'Gaṅgānātha Jhā, "The Yoga-Darśana: The Sūtras of Patañjali with the Bhāṣya of Vyāsa," Bombay, 1907.',
    'sanskritdocuments.org — Pātañjala Yogasūtra, Devanāgarī (with and without Vedic accents); accents stripped here.',
    'wisdomlib.org — per-sūtra transcription of Rama Prasada\'s translation and glosses.'
  ],

  datingNote: 'c. 325–425 CE (Maas, via Vasubandhu synchronisms); the Pātañjalayogaśāstra unified-authorship thesis (Maas 2013) is the current leading view, with dissent; the grammarian-Patañjali conflation is post-Bhoja and rejected by most modern scholars.',

  cite: 'Pātañjala Yoga-sūtra — Book I (Samādhi-pāda), 51 sūtras. Devanāgarī: sanskritdocuments.org (Vedic accents stripped); word-by-word glosses: Rama Prasada (SBH IV, 1912); whole-sūtra translations: Woods (HOS 17, 1914).'
};
