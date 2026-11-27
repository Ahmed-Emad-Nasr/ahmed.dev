/*
 * ═══ data/adhkar.ts — the small remembrances ═══
 *
 * components/layout/DhikrToast.tsx shows one of these now and then, in a
 * small card at the bottom of the page. Each text was checked against its
 * source before it went in — keep it that way: copy a new one from a
 * trusted mushaf (quran.com) or hadith book (sunnah.com, dorar.net) and
 * keep the tashkeel exactly as written there.
 *
 * Sources checked: the Quran verses against quran.com (text and number);
 * the hadiths against the Dorar al-Saniyya hadith encyclopedia and
 * HadeethEnc, with the book each one is from.
 *
 * TO EDIT: change a line, or add one to the list. The cards go round the
 * list in order, starting from a random one each visit — so keep the
 * Quran and hadith ones mixed, not in two blocks.
 *   id     → any unique ASCII word
 *   label  → the small title next to the moon
 *   text   → the remembrance, fully voweled
 *   source → where it comes from (shown small under the text)
 */

export type Dhikr = { id: string; label: string; text: string; source: string };

export const ADHKAR: Dhikr[] = [
  {
    id: "istighfar",
    label: "استغفار",
    text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
    source: "رواه البخاري",
  },
  {
    id: "rabbana-hasana",
    label: "خير الدنيا والآخرة",
    text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    source: "البقرة: 201",
  },
  {
    id: "tasbih",
    label: "خفيفتان على اللسان",
    text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    source: "متفق عليه",
  },
  {
    id: "sharh-sadr",
    label: "شرح الصدر",
    text: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    source: "طه: 25-26",
  },
  {
    id: "tumanina",
    label: "طمأنينة",
    text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    source: "الرعد: 28",
  },
  {
    id: "tathbit",
    label: "ثبات على الدين",
    text: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
    source: "رواه الترمذي",
  },
  {
    id: "hawqala",
    label: "كنز من كنوز الجنة",
    text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    source: "حديث أبي موسى رضي الله عنه",
  },
  {
    id: "zidni-ilma",
    label: "زدني علمًا",
    text: "رَّبِّ زِدْنِي عِلْمًا",
    source: "طه: 114",
  },
  {
    id: "istighfar-quran",
    label: "استغفار",
    text: "وَاسْتَغْفِرُوا اللَّهَ ۖ إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ",
    source: "المزمل: 20",
  },
  {
    id: "afw",
    label: "عفو",
    text: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    source: "رواه الترمذي",
  },
  {
    id: "zalamna",
    label: "توبة",
    text: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    source: "الأعراف: 23",
  },
  {
    id: "ahabb-alkalam",
    label: "أحب الكلام إلى الله",
    text: "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ",
    source: "رواه مسلم",
  },
  {
    id: "mashaallah",
    label: "ما شاء الله",
    text: "مَا شَاءَ اللَّهُ لَا قُوَّةَ إِلَّا بِاللَّهِ",
    source: "الكهف: 39",
  },
  {
    id: "tasbih-tawba",
    label: "تسبيح وتوبة",
    text: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    source: "الأنبياء: 87",
  },
  {
    id: "ain-ibada",
    label: "عون على العبادة",
    text: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    source: "رواه أبو داود والنسائي",
  },
  {
    id: "hidaya",
    label: "دوام الهداية",
    text: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ",
    source: "آل عمران: 8",
  },
  {
    id: "rahma",
    label: "رحمة ومغفرة",
    text: "رَّبِّ اغْفِرْ وَارْحَمْ وَأَنتَ خَيْرُ الرَّاحِمِينَ",
    source: "المؤمنون: 118",
  },
  {
    id: "iftiqar",
    label: "افتقار إلى الله",
    text: "رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
    source: "القصص: 24",
  },
  {
    id: "tawfiq",
    label: "التوفيق من الله",
    text: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ",
    source: "هود: 88",
  },
  {
    id: "birr",
    label: "برّ الوالدين",
    text: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    source: "الإسراء: 24",
  },
];
