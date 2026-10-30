// Selected textual/community references, never calendar events or ranking inputs.
// Original paraphrases only. Full downloaded texts stay outside the repository.
const freeze = value => {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
};

const ACCESS = {
  "christian-usccb": {
    "url": "https://bible.usccb.org/bible/mark/13",
    "retrievalURL": "https://bible.usccb.org/bible/mark/13",
    "retrievedAt": "2026-10-30T04:21:58.441619+00:00",
    "httpStatus": 200,
    "contentSHA256": "9b1fa0ebdddc79dfbd8b29b8f4f459e31ed0005fd030485e183a204172ca902a"
  },
  "christian-catechism": {
    "url": "https://www.vatican.va/archive/ENG0015/__P1V.HTM",
    "retrievalURL": "https://www.vatican.va/archive/ENG0015/__P1V.HTM",
    "retrievedAt": "2026-10-30T04:21:58.442228+00:00",
    "httpStatus": 200,
    "contentSHA256": "c8bfacff7c1250cf681d9955d1fa4b37bc24b7cdf30ce968d35018f1413a0e08"
  },
  "jewish-sefaria": {
    "url": "https://www.sefaria.org/Sanhedrin.97b.9?lang=bi",
    "retrievalURL": "https://www.sefaria.org/api/texts/Sanhedrin.97b?lang=en",
    "retrievedAt": "2026-10-30T04:21:58.442994+00:00",
    "httpStatus": 200,
    "contentSHA256": "554ceb71321df697e0d2e4dbaeeb0562a12240b07ad03bc3146c1cc042dabf67"
  },
  "islamic-quran": {
    "url": "https://quran.com/en/al-araf/187",
    "retrievalURL": "https://quran.com/en/al-araf/187",
    "retrievedAt": "2026-10-30T04:21:58.443354+00:00",
    "httpStatus": 200,
    "contentSHA256": "e212b7c3b6f58f60a5eee5e47f7ce942da738b6c5af766c16241ce258ded4767"
  },
  "islamic-quran31": {
    "url": "https://quran.com/en/luqman/34",
    "retrievalURL": "https://quran.com/en/luqman/34",
    "retrievedAt": "2026-10-30T04:21:58.443977+00:00",
    "httpStatus": 200,
    "contentSHA256": "de0dcf29c0c72b6529a8638b8bf82f96807b378c7e4e9d0a09f732c5423554e7"
  },
  "hindu-bhagavata": {
    "url": "https://vedabase.io/en/library/sb/12/2/",
    "retrievalURL": "https://vedabase.io/en/library/sb/12/2/",
    "retrievedAt": "2026-10-30T04:21:58.449830+00:00",
    "httpStatus": 200,
    "contentSHA256": "676fe078cd0dfc414442612fb6e2a82601092c4a3966e23605647e9cebbaaf28"
  },
  "hindu-gita": {
    "url": "https://www.holy-bhagavad-gita.org/chapter/4/verse/7/",
    "retrievalURL": "https://www.holy-bhagavad-gita.org/chapter/4/verse/7",
    "retrievedAt": "2026-10-30T04:21:58.450340+00:00",
    "httpStatus": 200,
    "contentSHA256": "3a49262b162a725b807315a1bf0851bbe23327519ff687674b44ca17b73ce4a4"
  },
  "buddhist-dn26": {
    "url": "https://suttacentral.net/dn26/en/sujato",
    "retrievalURL": "https://suttacentral.net/dn26/en/sujato",
    "retrievedAt": "2026-10-30T04:21:58.778610+00:00",
    "httpStatus": 200,
    "contentSHA256": "54b9315991a6bf6f6eef7e9d4f71e9a865aec686c3afbf830dafaea98fe6f340"
  },
  "buddhist-dn26-api": {
    "url": "https://suttacentral.net/dn26/en/sujato#25.1",
    "retrievalURL": "https://suttacentral.net/api/bilarasuttas/dn26/sujato?lang=en",
    "retrievedAt": "2026-10-30T04:21:59.045205+00:00",
    "httpStatus": 200,
    "contentSHA256": "bfb80b139159bc8ce9d0dd95e57c1ca5881a081670bd6bbc55f59d7eab1ed60b"
  },
  "bahai-questions": {
    "url": "https://www.bahai.org/library/authoritative-texts/abdul-baha/some-answered-questions/4",
    "retrievalURL": "https://www.bahai.org/library/authoritative-texts/abdul-baha/some-answered-questions/4",
    "retrievedAt": "2026-10-30T04:21:59.309354+00:00",
    "httpStatus": 200,
    "contentSHA256": "1bf883c4d2f979482eafebdc962cd3b5bf8206c1c6a84c3ff5fa713bb55a61f4"
  },
  "bahai-calendar": {
    "url": "https://www.bahai.org/action/devotional-life/calendar",
    "retrievalURL": "https://www.bahai.org/action/devotional-life/calendar",
    "retrievedAt": "2026-10-30T04:21:59.494120+00:00",
    "httpStatus": 200,
    "contentSHA256": "7af7d1216791c838d9bc9216bd54918c2c7fb1c54266a2baffc0a48df90ac0f2"
  },
  "zoroastrian-iranica": {
    "url": "https://www.iranicaonline.org/articles/frasokrti/",
    "retrievalURL": "https://www.iranicaonline.org/articles/frasokrti",
    "retrievedAt": "2026-10-30T04:21:59.716286+00:00",
    "httpStatus": 200,
    "contentSHA256": "ce5d06b44c1428fa4faa35681c1887c30e4846512547988405e6a012f7e5e5c0"
  },
  "zoroastrian-avesta": {
    "url": "https://www.avesta.org/ka/yt19sbe.htm",
    "retrievalURL": "https://www.avesta.org/ka/yt19sbe.htm",
    "retrievedAt": "2026-10-30T04:21:59.749019+00:00",
    "httpStatus": 200,
    "contentSHA256": "c409da7dc33673685911b5d73d6e1cbb2eca0c3ecde987b9878899f3eab32533"
  },
  "shinto-yomi": {
    "url": "https://d-museum.kokugakuin.ac.jp/eos/detail/?id=8997",
    "retrievalURL": "https://d-museum.kokugakuin.ac.jp/eos/detail/?id=8997",
    "retrievedAt": "2026-10-30T04:21:59.772064+00:00",
    "httpStatus": 200,
    "contentSHA256": "0f96af2eb163137c6057f451aa07f48b897136d568ea8ba9e1c23e174a240c01"
  },
  "shinto-jinja": {
    "url": "https://www.jinjahoncho.or.jp/en/shinto/veneration-of-nature/",
    "retrievalURL": "https://www.jinjahoncho.or.jp/en/spiritual/index.html",
    "retrievedAt": "2026-10-30T04:22:00.083570+00:00",
    "httpStatus": 200,
    "contentSHA256": "0e6170efec5d17f5a05f2d9bcc154fef3f3083f603b4c3e640658cb240c50058"
  },
  "chinese-daoism": {
    "url": "https://plato.stanford.edu/entries/daoism-religion/",
    "retrievalURL": "https://plato.stanford.edu/entries/daoism-religion/",
    "retrievedAt": "2026-10-30T04:22:00.219642+00:00",
    "httpStatus": 200,
    "contentSHA256": "4379627fbabe9367b0760473ece03414e5378d39b2c701c129b6a6be639baf6e"
  },
  "jewish-mishneh": {
    "url": "https://www.sefaria.org/Mishneh_Torah%2C_Kings_and_Wars.12.2?lang=bi",
    "retrievalURL": "https://www.sefaria.org/api/texts/Mishneh_Torah%2C_Kings_and_Wars.12?lang=en",
    "retrievedAt": "2026-10-30T04:22:59.034298+00:00",
    "httpStatus": 200,
    "contentSHA256": "f9171f8d9fd67427dce9ee38b8b69f240d5a291bb59243299ebdcaeff9067118"
  },
  "sikh-rehat-current": {
    "url": "https://sgpc.net/sikh-rehat-maryada-in-english/",
    "retrievalURL": "https://sgpc.net/sikh-rehat-maryada-in-english/",
    "retrievedAt": "2026-10-30T04:22:59.035285+00:00",
    "httpStatus": 200,
    "contentSHA256": "016cd3f2e86301392d0edc57006461f733ff451cd75662b5cf259150c89ffd4a"
  },
  "sikh-coalition": {
    "url": "https://www.sikhcoalition.org/about-sikhs/",
    "retrievalURL": "https://www.sikhcoalition.org/about-sikhs/",
    "retrievedAt": "2026-10-30T04:22:59.035806+00:00",
    "httpStatus": 200,
    "contentSHA256": "070ffa69ec673a7908ea32db4e3f3bd01d195416a7d361854be16d974d8d3e2d"
  },
  "jainpedia-search": {
    "url": "https://jainpedia.org/?s=universe",
    "retrievalURL": "https://jainpedia.org/?s=universe",
    "retrievedAt": "2026-10-30T04:22:59.037073+00:00",
    "httpStatus": 200,
    "contentSHA256": "9ab900d2c08d82ea0503562d15b9dfd597d76b26f182af20bbf30a8c5c5e632b"
  },
  "jainpedia-time": {
    "url": "https://jainpedia.org/manuscript/times-between-gods-deaths-and-rebirths/",
    "retrievalURL": "https://jainpedia.org/themes/principles/universe/time/",
    "retrievedAt": "2026-10-30T04:22:59.345792+00:00",
    "httpStatus": 200,
    "contentSHA256": "ed2b60a3ff5313b081adc6a20360328ddc1379911ef4a2bc9d70b7973cc11ce4"
  },
  "jain-academic": {
    "url": "https://iep.utm.edu/jain/",
    "retrievalURL": "https://iep.utm.edu/jain/",
    "retrievedAt": "2026-10-30T04:22:59.479039+00:00",
    "httpStatus": 200,
    "contentSHA256": "f104225fb4fdaf45eb534416d81db31d125340a85a79e5ed0b3eb6c95194b84a"
  },
  "bahai-questions2": {
    "url": "https://www.bahai.org/library/authoritative-texts/abdul-baha/some-answered-questions/3",
    "retrievalURL": "https://www.bahai.org/library/authoritative-texts/abdul-baha/some-answered-questions/3",
    "retrievedAt": "2026-10-30T04:22:59.536844+00:00",
    "httpStatus": 200,
    "contentSHA256": "6c4020ea4de796f460fb0d515a1e2865cafb18c32887a166f9788257554c71d0"
  },
  "sikh-rehat-pdf": {
    "url": "https://sgpc.net/storage/2026/06/Sikh_Rehat_Maryada_English.pdf",
    "retrievalURL": "https://sgpc.net/storage/2026/06/Sikh_Rehat_Maryada_English.pdf",
    "retrievedAt": "2026-10-30T04:24:08.485048+00:00",
    "httpStatus": 200,
    "contentSHA256": "aa9645db5b828549bd31eebe33dd84e9af3221d2327b4c36b2a08dbe63b618fc"
  },
  "jainpedia-universe": {
    "url": "https://jainpedia.org/article/themes/principles/jain-universe/",
    "retrievalURL": "https://jainpedia.org/article/themes/principles/jain-universe/",
    "retrievedAt": "2026-10-30T04:24:08.485585+00:00",
    "httpStatus": 200,
    "contentSHA256": "7dd5b5cb57fd83438db8be5ad6a8b7862a760c6064234810630dfc71a3b3bc2a"
  },
  "bahai-christian-sections": {
    "url": "https://www.bahai.org/library/authoritative-texts/abdul-baha/some-answered-questions/7",
    "retrievalURL": "https://www.bahai.org/library/authoritative-texts/abdul-baha/some-answered-questions/7",
    "retrievedAt": "2026-10-30T04:24:08.485981+00:00",
    "httpStatus": 200,
    "contentSHA256": "d0941cda7ae0089cb1fe3266bad17f0f36238c8ea01c16e65616d4ee83dbbb64"
  },
  "shinto-matsuri": {
    "url": "https://www.jinjahoncho.or.jp/en/shinto/matsuri/",
    "retrievalURL": "https://www.jinjahoncho.or.jp/en/shinto/matsuri/",
    "retrievedAt": "2026-10-30T04:24:08.486321+00:00",
    "httpStatus": 200,
    "contentSHA256": "4606cb1f56f69215ba10f22c888a0d31468a73bbc0975a615699bf95bfc3e082"
  },
  "adventist-second": {
    "url": "https://adventist.org/beliefs/official/second-coming",
    "retrievalURL": "https://adventist.org/second-coming/",
    "retrievedAt": "2026-10-30T04:24:08.486609+00:00",
    "httpStatus": 200,
    "contentSHA256": "57f7fc6e54d8987dab83af122d82f7344ac3e3823858bdcfa0e3ddc21efe0ea6"
  },
  "buddhist-license": {
    "url": "https://suttacentral.net/licensing",
    "retrievalURL": "https://suttacentral.net/licensing",
    "retrievedAt": "2026-10-30T04:24:08.486940+00:00",
    "httpStatus": 200,
    "contentSHA256": "0f52d4b0754c9f82ed84cca1f89c6d316b227eec24d15127a443ffd6635e2e3b"
  },
  "hindu-gita8": {
    "url": "https://www.holy-bhagavad-gita.org/chapter/4/verse/8/",
    "retrievalURL": "https://www.holy-bhagavad-gita.org/chapter/4/verse/8/",
    "retrievedAt": "2026-10-30T04:24:08.736468+00:00",
    "httpStatus": 200,
    "contentSHA256": "41a07e835b6170193cd7b4c9117db3a32be7ab3123daeb98e6e97b21d0580dc5"
  }
};

const source = (id, receiptId, title, publisher, edition, locator, readingDepth, sourceKind, rights, limitations = []) => ({
  id, title, publisher, edition, locator, readingDepth, sourceKind, rights, limitations,
  ...ACCESS[receiptId], receiptId, receiptPath: 'docs/evidence/horizon/traditions/source-receipt.json',
  accessStatus: 'selected-passage-read', claimType: 'attributed-reference',
  fullWorkRead: false, supportsCalendarCalculation: false,
});
const modernRights = 'Copyright or edition-specific rights retained by the publisher/translator. This module stores an original short paraphrase, not the source text; no expanded training licence is inferred.';

export const HORIZON_TRADITION_SOURCES = freeze([
  source('HTR-CHRISTIAN-MARK', 'christian-usccb', 'Mark 13:32–37', 'United States Conference of Catholic Bishops', 'New American Bible, Revised Edition, online chapter', 'Mark 13:32–37; associated chapter note on 13:3–37', 'Selected verses and associated note read on 2026-10-30; not a complete Bible or commentary reading.', 'primary-text-translation', modernRights, ['The note distinguishes the temple narrative and parousia; a chapter excerpt is not a survey of Christian interpretations.']),
  source('HTR-CHRISTIAN-CATECHISM', 'christian-catechism', 'Catechism of the Catholic Church', 'The Holy See', 'Official English online Catechism', 'Paragraphs 673 and 675–677', 'Selected paragraphs read on 2026-10-30, including unknown times and the distinction from millenarianism.', 'official-community-teaching', modernRights, ['Describes Catholic teaching, not every Christian denomination.']),
  source('HTR-CHRISTIAN-ADVENTIST', 'adventist-second', 'The Second Coming of Christ', 'Seventh-day Adventist Church', 'Official belief page, current retrieved version', 'Official belief paragraph beginning “The second coming of Christ is the blessed hope…”; sentence on the unrevealed time', 'Official belief paragraph and literal/visible-return explanation read on 2026-10-30; not a complete denominational history.', 'official-community-teaching', modernRights, ['Current official belief is distinct from nineteenth-century date-setting history; no historical predicted date is encoded here.']),
  source('HTR-JEWISH-SANHEDRIN', 'jewish-sefaria', 'Babylonian Talmud, Sanhedrin 97b', 'Sefaria / William Davidson Edition', 'William Davidson Edition English; API declares CC-BY-NC', 'Sanhedrin 97b:1–2, 5–10 and 14; especially 97b:9', 'Selected English segments read on 2026-10-30, including conflicting calculations and criticism of failed end-date setting; not the complete tractate.', 'primary-text-translation', 'Sefaria API declares CC-BY-NC for this English edition. Only an original factual paraphrase is stored; attribution is retained and no unrestricted training/republication licence is claimed.', ['Multiple speakers and disputed expectations must not be collapsed into one unanimous timetable.']),
  source('HTR-JEWISH-MAIMONIDES', 'jewish-mishneh', 'Mishneh Torah, Kings and Wars 12', 'Sefaria / Moznaim', 'Eliyahu Touger translation, Jerusalem, Moznaim, c1986–2007; API declares CC-BY-NC', 'Chapter 12:1–2 and 12:4–5', 'Selected chapter sections read on 2026-10-30, including ordinary natural order, disputed sequence and rejection of calculating the appointed time.', 'primary-text-translation', 'English edition metadata declares CC-BY-NC. Original paraphrase only; underlying edition rights are not generalized.', ['This is Maimonides’ formulation, not an exhaustive statement of all Jewish messianic or afterlife traditions.']),
  source('HTR-ISLAM-QURAN-7', 'islamic-quran', 'Qur’an 7:187', 'Quran.com / Quran Foundation', 'Mustafa Khattab, The Clear Quran, displayed English translation', 'Sūrat al-Aʿrāf 7:187', 'The displayed verse translation read on 2026-10-30; the abbreviated tafsir preview is not treated as a full commentary reading.', 'primary-text-translation', modernRights, ['The selected verse does not supply a civil date or resolve all Sunni/Shia eschatological differences.']),
  source('HTR-ISLAM-QURAN-31', 'islamic-quran31', 'Qur’an 31:34', 'Quran.com / Quran Foundation', 'Mustafa Khattab, The Clear Quran, displayed English translation', 'Sūrat Luqmān 31:34', 'The displayed verse translation read on 2026-10-30.', 'primary-text-translation', modernRights, ['A second verse from the same text and translation is not an independent calendar fixture.']),
  source('HTR-HINDU-BHAGAVATA', 'hindu-bhagavata', 'Śrīmad-Bhāgavatam, canto 12, chapter 2', 'Bhaktivedanta Book Trust / Vedabase', 'BBT English Vaiṣṇava translation, chapter overview', '12.2.18–24, especially Kalki/renewal in 18–23 and the celestial condition in 24', 'Selected verse translations 18–24 read on 2026-10-30; no whole Purāṇa or cross-recension collation claimed.', 'primary-text-translation', modernRights, ['12.2.24 describes Sun, Moon and Bṛhaspati in Karkaṭa/Puṣya; no unique Gregorian date, chosen ayanāṃśa, exact contact definition or validated application algorithm is supplied.', 'A recurring modern angular configuration is not proof of the narrative’s fulfilment.']),
  source('HTR-HINDU-GITA-7', 'hindu-gita', 'Bhagavad Gītā 4.7', 'Holy Bhagavad Gita / Swami Mukundananda', 'Swami Mukundananda English translation and commentary page', '4.7, displayed Translation; opening commentary on avatāra', 'Verse translation and the opening explanatory paragraph read on 2026-10-30.', 'primary-text-translation', modernRights, ['A stated response to decline in dharma is not an algorithm for dating a future event.']),
  source('HTR-HINDU-GITA-8', 'hindu-gita8', 'Bhagavad Gītā 4.8', 'Holy Bhagavad Gita / Swami Mukundananda', 'Swami Mukundananda English translation and commentary page', '4.8, displayed Translation', 'Verse translation read on 2026-10-30; not the full commentary or work.', 'primary-text-translation', modernRights, ['This named Vaiṣṇava reading must not stand for every Hindu school.']),
  source('HTR-BUDDHIST-DN26', 'buddhist-dn26-api', 'Dīgha Nikāya 26, The Wheel-Turning Monarch', 'SuttaCentral', 'Bhikkhu Sujato English translation, segmented Bilara API', 'DN 26:23–26, especially 25.1–25.6; translated segments rather than commentary', 'Selected translated segments 23–26 actually read through the public API on 2026-10-30; the normal page supplied only an application shell.', 'primary-text-translation', 'Original paraphrase only. The licensing page also returned an application shell, so edition-specific reuse rights were not independently verified in this pass.', ['The narrated lifespan/cosmological setting is not an elapsed-years countdown from today.', 'A selected Pāli discourse cannot establish a universal Buddhist eschatology.']),
  source('HTR-SIKH-REHAT', 'sikh-rehat-pdf', 'Sikh Rehat Maryada, English', 'Shiromani Gurdwara Parbandhak Committee, Amritsar', 'Official scanned English PDF; translator Kulraj Singh’s preface dated 31 August 1994; PDF metadata created 2023', 'Section Four, Chapter X, Article XVI(a)–(d), printed/PDF p.36; continuation p.37', 'Contents and selected preface pages checked by OCR; Article XVI pp.36–37 read by OCR and p.36 visually inspected on 2026-10-30. No full-book reading.', 'official-community-discipline', modernRights, ['This selected discipline passage does not provide a comprehensive Sikh cosmology or a festival-date table.', 'English headings/divisions are the translator’s organization, as stated in the inspected preface.']),
  source('HTR-JAIN-JAINPEDIA', 'jainpedia-universe', 'Jain universe', 'JAINpedia; Nalini Balbir', 'Scholarly article on the JAINpedia project', 'Introduction; General principles; No beginning and no end; Symmetrical, repetitive structure', 'Selected sections read on 2026-10-30, including the quotation attributed to Hemacandra and Śvetāmbara/Digambara qualifications.', 'academic-reference', modernRights, ['Hemacandra is quoted through this scholarly article; the underlying Sanskrit work and full Johnson translation were not independently read.']),
  source('HTR-JAIN-IEP', 'jain-academic', 'Jain Philosophy', 'Internet Encyclopedia of Philosophy; Mark Owen Webb', 'Online scholarly encyclopedia article', 'Section 1, Metaphysics: uncreated universe, souls, karma and release', 'Selected Metaphysics paragraphs and author metadata read on 2026-10-30.', 'academic-reference', modernRights, ['This broad philosophical account is not a current observance calendar or a survey of every Jain community.']),
  source('HTR-BAHAI-QUESTIONS', 'bahai-christian-sections', 'Some Answered Questions', 'Bahá’í Reference Library; ‘Abdu’l-Bahá', 'Official current English online edition', 'Chapter 26, The Second Coming of Christ and the Day of Judgement, paragraphs 1–6', 'Complete selected chapter 26 read on 2026-10-30; not the entire work or the separately referenced Kitáb-i-Íqán.', 'authoritative-community-text', modernRights, ['This is a Bahá’í interpretation of Christian imagery, not a neutral claim that Christian communities adopt it.', 'The chapter’s historical astronomical illustrations are not adopted as modern measured stellar facts.']),
  source('HTR-BAHAI-CALENDAR', 'bahai-calendar', 'The Bahá’í Calendar', 'Bahá’í International Community website', 'Official current calendar introduction and year selector', 'Introductory paragraphs: nineteen months, intercalary days, Naw-Rúz, Twin Birthdays and sunset day boundary', 'Introduction and availability of published year choices read on 2026-10-30. This source role did not validate every year-table date; the observance owner handles dated rows.', 'official-calendar-reference', modernRights, ['The equinox rule is not replaced with a universal fixed 21 March date.', 'Religious day boundaries and local civil labels differ; this metadata module computes neither.']),
  source('HTR-ZORO-YASHT', 'zoroastrian-avesta', 'Zamyād Yašt', 'Avesta.org; James Darmesteter translation', 'Sacred Books of the East, volume 23, historical English translation', 'Yašt 19, sections 89–96, especially 89–90', 'Selected restoration/resurrection passage and following sections read on 2026-10-30; no complete Avesta reading or new linguistic collation.', 'primary-text-translation', 'Historical Darmesteter translation is public domain; website/editor credited. Only original paraphrase is stored here.', ['Historical transliterations and theological claims are retained as source attribution, not verified future physical events.']),
  source('HTR-ZORO-IRANICA', 'zoroastrian-iranica', 'FRAŠŌ.KƎRƎTI', 'Encyclopaedia Iranica; Almut Hintze', 'Vol. X, fasc. 2, pp.190–192; published 2000, updated 2014', 'Opening definition; Allusions in the Younger Avesta, with Yt.19 locators', 'Definition and selected Younger Avesta discussion read on 2026-10-30; not every philological argument or cited work.', 'academic-reference', modernRights, ['The discussion distinguishes textual layers and uncertain meanings; it does not provide a validated Gregorian date for renovation.']),
  source('HTR-SHINTO-KAKURIYO', 'shinto-yomi', 'Kakuriyo', 'Kokugakuin University, Encyclopedia of Shinto', 'Online English encyclopedia entry', 'Category 7, Concepts and Doctrines / Basic Terms; complete Kakuriyo entry', 'The complete short entry was read on 2026-10-30; the initially guessed URL resolved to Kakuriyo, not a separate Yomi article.', 'academic-reference', modernRights, ['The entry says the hidden realm does not necessarily mean only the world after death; it is not an end-of-world timetable.']),
  source('HTR-SHINTO-MATSURI', 'shinto-matsuri', 'Matsuri', 'Jinja Honcho', 'Official English introduction', 'Opening three paragraphs and statement that local traditions vary between jinja', 'The short Matsuri page read on 2026-10-30; local shrine schedules were not surveyed.', 'official-community-reference', modernRights, ['Seasonal and shrine-specific rituals do not establish one universal festival timetable or eschatological claim.']),
  source('HTR-DAOISM-SEP', 'chinese-daoism', 'Religious Daoism', 'Stanford Encyclopedia of Philosophy; Fabrizio Pregadio', 'Online article, copyright 2020 by Fabrizio Pregadio', 'Section 2.5, The Divinization of Laozi: Taiping jing and early millenarian movements', 'Selected section on Great Peace and early historical messianic expectations read on 2026-10-30; not the whole long article or the primary Taiping jing.', 'academic-reference', modernRights, ['This historical Daoist scope is not all Chinese religion, modern Daoist consensus, or an independently checked primary-text translation.']),
]);

const tradition = (familyId, label, scope, summary, status, eschatologySummary, sourceIds, calendarNotes, limitations, extra = {}) => ({
  id: `HTR-${familyId.toUpperCase()}`, familyId, label, scope, summary,
  eschatology: { status, summary: eschatologySummary, sourceIds: [...sourceIds], dateability: 'No independently validated modern calendar date is supplied by this selected reference.' },
  calendarNotes, datedClaims: [], sourceIds, limitations,
  contributesToRanking: false, claimType: 'attributed-reference', ...extra,
});

export const HORIZON_TRADITIONS = freeze([
  tradition('christian', 'Christian traditions · selected texts and teachings', 'Mark plus current Catholic and Seventh-day Adventist statements; not all Christian denominations.',
    'The selected sources discuss Christ’s return, judgment and watchfulness while withholding a known day or hour.', 'undated',
    'Mark 13:32–37 withholds the time. Catholic Catechism 673 and current Adventist teaching likewise give no revealed date; their wider doctrinal accounts remain distinct.',
    ['HTR-CHRISTIAN-MARK','HTR-CHRISTIAN-CATECHISM','HTR-CHRISTIAN-ADVENTIST'],
    ['Separately sourced Christian feast dates and computus variants belong to the observance layer; they do not date the Second Coming.'],
    ['No single Catholic or Adventist statement represents every Christian community.', 'Historical date-setting movements are not silently substituted for these current statements.']),
  tradition('jewish', 'Jewish traditions · selected rabbinic messianism', 'Selected Sanhedrin passages and Maimonides; not an exhaustive account of Jewish belief.',
    'The checked rabbinic passages preserve debate about redemption and explicitly warn against calculating its end date.', 'undated',
    'Sanhedrin 97b records conflicting historical calculations and criticism of failed deadlines. Maimonides, Kings and Wars 12:1–2, distinguishes messianic hope from a certain sequence or date and describes the ordinary natural order continuing.',
    ['HTR-JEWISH-SANHEDRIN','HTR-JEWISH-MAIMONIDES'],
    ['A Hebrew civil date or a sourced festival rule is not a messianic countdown. Observance location, boundary and community variants remain in the dated layer.'],
    ['Multiple Talmudic speakers are not one unanimous prediction.', 'Maimonides is one influential formulation; later Jewish traditions are not exhaustively covered.'],
    { historicalDateSetting: { status: 'reported-and-criticized-in-selected-text', sourceIds: ['HTR-JEWISH-SANHEDRIN'], modernDateAssigned: false } }),
  tradition('islamic', 'Islamic traditions · the Hour in selected Qur’anic verses', 'Qur’an 7:187 and 31:34 in one named English translation; detailed Sunni/Shia traditions not surveyed.',
    'The selected verses place knowledge of the Hour with God rather than supplying people with a calendar deadline.', 'undated',
    'Qur’an 7:187 and 31:34 explicitly reserve knowledge of the Hour to God. This reference therefore provides no dated end-time event.',
    ['HTR-ISLAM-QURAN-7','HTR-ISLAM-QURAN-31'],
    ['Calculated Islamic civil/Umm al-Qura labels and observed lunar starts are different methods. Neither calendar conversion dates the Hour.'],
    ['Two verses from one text/translation are not independent predictive confirmations.', 'Mahdi, resurrection and end-time sign traditions require their own named sources; they are not synthesized here.']),
  tradition('hindu', 'Hindu traditions · selected Vaiṣṇava renewal narratives', 'Bhāgavata 12.2 and Bhagavad Gītā 4.7–8 in named modern Vaiṣṇava translations.',
    'These passages describe restoration of dharma and, in the Bhāgavata, Kalki followed by a renewed age.', 'non-dateable',
    'Bhāgavata 12.2.18–23 describes Kalki and Satya-yuga. Verse 24 gives a Sun–Moon–Bṛhaspati/Puṣya condition, but this reference has no validated rule for identifying a unique modern fulfillment date. Gītā 4.7–8 describes restoration age after age, not a dated countdown.',
    ['HTR-HINDU-BHAGAVATA','HTR-HINDU-GITA-7','HTR-HINDU-GITA-8'],
    ['A civil Saka label does not calculate regional Hindu festival rules. Regional tithi, sunrise and tradition choices require separately sourced algorithms or published dates.'],
    ['No yuga epoch or duration is converted to an apocalypse date here.', 'An astronomical recurrence cannot independently validate the religious narrative.', 'Śaiva, Śākta and other Hindu accounts are outside this selected scope.'],
    { textualConfiguration: { locator: 'Bhāgavata 12.2.24', bodies: ['Sun','Moon','Jupiter'], terms: ['Karkaṭa','Puṣya'], status: 'attributed-textual-condition-not-implemented', missing: ['validated epoch/frame convention','precise simultaneous-entry definition','independent textual and calendrical validation'], contributesToRanking: false } }),
  tradition('buddhist', 'Buddhist traditions · Metteyya in DN 26', 'Selected Pāli discourse in Bhikkhu Sujato’s translation; not every Buddhist school.',
    'DN 26 places the future Buddha Metteyya in a narrative of changed human conduct, lifespans and renewed flourishing.', 'non-dateable',
    'DN 26:23–26 narrates Metteyya’s arising in a specified cosmological setting. Its lifespan figures are not an elapsed-years counter anchored to the present Gregorian year.',
    ['HTR-BUDDHIST-DN26'],
    ['A Thai Buddhist civil-era label is not a complete Buddhist lunar observance calendar. Vesak and other observances need regional published or calculated conventions.'],
    ['One discourse does not represent all Theravāda, Mahāyāna or Vajrayāna accounts.', 'No near-term Maitreya date or literal demographic forecast is inferred.']),
  tradition('sikh', 'Sikh tradition · selected conduct boundary', 'SGPC English Sikh Rehat Maryada, Article XVI; cosmology not comprehensively assessed.',
    'The inspected discipline passage grounds conduct in the Guru’s tenets and explicitly rejects auspicious-day and horoscopic beliefs.', 'not-assessed',
    'This selected source is a conduct code, not an eschatological timetable. No Sikh end-time claim is inferred from it, and no festival is given an astrological good/bad value.',
    ['HTR-SIKH-REHAT'],
    ['Article XVI(d), p.36, rejects belief in auspicious times/days and stellar or horoscopic influence. A sourced Sikh observance date must remain separate from astrology-purpose scores.'],
    ['This is not a claim that the whole Sikh tradition lacks cosmological teachings.', 'No Nanakshahi festival dates are inferred from this conduct passage.']),
  tradition('jain', 'Jain traditions · an uncreated universe and liberation', 'Selected scholarly accounts by Nalini Balbir and Mark Owen Webb.',
    'The checked accounts describe an uncreated, enduring universe, recurring time cycles and liberation of souls.', 'non-dateable',
    'These accounts do not describe a single created world ending at a modern calendar deadline. Cosmic cycles and individual liberation are not converted into a near-term universal apocalypse.',
    ['HTR-JAIN-JAINPEDIA','HTR-JAIN-IEP'],
    ['No Jain festival schedule is derived from a generic civil-calendar label. Sect and regional observance rules need their own sources.'],
    ['Śvetāmbara and Digambara terminology and numerical details can differ.', 'The underlying primary scriptures were not newly collated; these are named scholarly summaries.']),
  tradition('bahai', 'Bahá’í Faith · interpreted signs and a distinct calendar', '‘Abdu’l-Bahá, Some Answered Questions 26, plus the official calendar introduction.',
    'The selected authoritative Bahá’í chapter interprets return and judgment imagery through inner meanings, separately from its calculable observance calendar.', 'non-dateable',
    'Some Answered Questions 26:5–6 says the cited signs have inner meanings and should not be read literally. This does not produce a future physical catastrophe date or make the interpretation Christian consensus.',
    ['HTR-BAHAI-QUESTIONS','HTR-BAHAI-CALENDAR'],
    ['The official calendar describes sunset-to-sunset days, equinox-linked Naw-Rúz and Twin Birthdays after the eighth new moon. Published dated rows are handled separately; this reference computes none.'],
    ['The separately cited Kitáb-i-Íqán was not newly read here.', 'Historical astronomical illustrations in the chapter are not reused as modern measurements.']),
  tradition('zoroastrian', 'Zoroastrian traditions · final renovation', 'Zamyād Yašt 19 in Darmesteter’s translation, cross-read with Almut Hintze’s Iranica discussion.',
    'The selected texts describe frašō.kərəti, renovation of creation, resurrection and the overcoming of evil.', 'undated',
    'Yašt 19:89–96 and the selected Iranica discussion concern restoration and the savior tradition. They provide no independently validated Gregorian date for an event within this horizon.',
    ['HTR-ZORO-YASHT','HTR-ZORO-IRANICA'],
    ['This eschatology reference does not choose among Fasli, Shahanshahi or Qadimi observance methods; a separately named source is needed for each date rule.'],
    ['Textual layers and translations differ; a historical translation is not a complete account of present community belief.', 'No ancient cosmic chronology is silently converted into a modern deadline.']),
  tradition('shinto', 'Shinto · hidden realm and local ritual continuity', 'Kokugakuin’s Kakuriyo entry and Jinja Honcho’s Matsuri introduction; no survey of new religious movements.',
    'The selected sources discuss the hidden realm, kami and varied community rites rather than furnishing a universal end-of-world timetable.', 'not-assessed',
    'Kakuriyo is explained as a hidden realm, not necessarily only an after-death world. The Matsuri source describes community and seasonal rites. Neither selected passage supplies a dated apocalypse; this limited reading is not proof that every Shinto-related movement lacks eschatology.',
    ['HTR-SHINTO-KAKURIYO','HTR-SHINTO-MATSURI'],
    ['Jinja Honcho explicitly notes substantial local variation between shrines. A universal Shinto festival schedule cannot be inferred from this introductory page.'],
    ['Sect Shinto and Shinto-based new religions require separately named research.', 'Afterlife vocabulary, seasonal renewal and a world-ending prediction are different claim types.']),
  tradition('chinese', 'Other selected tradition · historical Daoist Great Peace', 'Early historical Daoist millenarianism in Fabrizio Pregadio’s SEP account; not all Chinese religion.',
    'The selected scholarly discussion describes Great Peace ideals and historically situated messianic expectations in early Daoist movements.', 'historical-not-current',
    'The Taiping jing and early Laozi/Laojun expectations are described as historical traditions. They are not imported as a current Daoist prediction or as a future date for every Chinese community.',
    ['HTR-DAOISM-SEP'],
    ['Chinese civil lunar dates and publicly sourced festivals are separate from this historical doctrinal reference. Runtime conversion disagreements must not be resolved by eschatological claims.'],
    ['The primary Taiping jing was not newly read; this is a selected scholarly account.', 'Confucian, folk-religious, Indigenous and other traditions are not comprehensively covered.']),
]);

export const HORIZON_TRADITION_COVERAGE = freeze({
  kind: 'selected-attributed-reference-library', families: HORIZON_TRADITIONS.map(x => x.familyId),
  completeReligionsSurvey: false, humanReligiousAuthorityReview: false, fullWorksRead: false,
  datedEschatologicalEvents: 0, contributesToRanking: false,
  missing: ['Full doctrinal diversity within every family','Indigenous, African and other traditions beyond the explicitly named sample','Independent primary-language collation of every passage','Community review of every summary'],
  note: 'No checked source establishes a dated apocalypse within 2026-10-30–2031-01-01. This is a statement about this selected corpus, not proof about all religious literature.',
});
