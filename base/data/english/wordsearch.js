const data = [
  {
    slug: "daysOfWeek",
    words: [
      { word: "saturday", marker: [0, 0, 7, 0] },
      { word: "sunday", marker: [0, 0, 0, 5] },
      { word: "monday", marker: [1, 2, 6, 2] },
      { word: "thursday", marker: [1, 6, 8, 6] },
      { word: "wednesday", marker: [0, 7, 8, 7] },
      { word: "friday", marker: [2, 3, 7, 3] },
      { word: "tuesday", marker: [8, 0, 8, 6] },
    ],
    showWords: false,
    lang: "en",
    desc: "Find the days of the week.",
    table: `SATURDAYT
    UEHQSXBOU
    NMONDAYVE
    DDFRIDAYS
    AGZHXJJFD
    YAGPMKQGA
    DTHURSDAY
    WEDNESDAY`,
  },
  {
    slug: "planets",
    words: [
      { word: "mercury", marker: [1, 0, 7, 6] },
      { word: "neptune", marker: [1, 1, 7, 1] },
      { word: "venus", marker: [7, 0, 7, 4] },
      { word: "earth", marker: [0, 3, 4, 7] },
      { word: "mars", marker: [0, 4, 3, 4] },
      { word: "jupiter", marker: [6, 2, 0, 8] },
      { word: "uranus", marker: [2, 8, 7, 8] },
      { word: "saturn", marker: [8, 1, 8, 6] },
    ],
    showWords: false,
    lang: "en",
    desc: "Identify all planets in solar system",
    table: `QMFMCPVVN
    FNEPTUNES
    GNBRMSJNA
    ENOTCUGUT
    MARSPUDSU
    TPRIUURXR
    CRTTHUOYN
    TESYHTNSL
    RAURANUSS`,
  },
  {
    slug: "monthsOfYear",
    words: [
      { word: "February", marker: [0, 9, 7, 9] },
      { word: "September ", marker: [3, 1, 3, 9] },
      { word: "January ", marker: [7, 3, 7, 9] },
      { word: "December ", marker: [6, 2, 6, 9] },
      { word: "June", marker: [4, 1, 7, 1] },
      { word: "July", marker: [4, 1, 4, 4] },
      { word: "November ", marker: [0, 0, 7, 0] },
      { word: "October ", marker: [1, 0, 1, 6] },
      { word: "August", marker: [5, 2, 5, 7] },
      { word: "April", marker: [0, 2, 0, 6] },
      { word: "March", marker: [2, 1, 2, 5] },
      { word: "May", marker: [0, 8, 2, 8] },
    ],
    showWords: false,
    lang: "en",
    desc: "Find the months of the year.",
    table: `NOVEMBER
      DCMSJUNE
      ATAEUADO
      PORPLUEJ
      RBCTYGCA
      IEHEYUEN
      LROMUSMU
      XDZBETBA
      MAYEUXER
      FEBRUARY`,
  },
  {
    slug: "animals",
    words: [
      { word: "tiger", marker: [3, 3, 7, 7] },
      { word: "lion", marker: [3, 4, 6, 4] },
      { word: "goat", marker: [0, 3, 3, 3] },
      { word: "monkey", marker: [2, 6, 7, 6] },
      { word: "dog", marker: [5, 3, 5, 5] },
      { word: "cat", marker: [3, 1, 3, 3] },
      { word: "zebra", marker: [0, 5, 4, 9] },
      { word: "cow", marker: [5, 0, 7, 2] },
      { word: "panda", marker: [0, 9, 4, 9] },
      { word: "deer", marker: [1, 4, 1, 7] },
      { word: "bear", marker: [2, 1, 2, 4] },
      { word: "wolf", marker: [1, 0, 4, 0] },
    ],
    showWords: true,
    lang: "en",
    desc: "Find the animals given at the bottom.",
    table: `LWOLFCQL
    CCBCYSOC
    VFEAHJXW
    GOATWDNL
    RDRLIONH
    ZEFMCGLZ
    MEMONKEY
    ZRBQUMCR
    HJDRMLGU
    PANDAEHX`,
  },
  {
    slug: "vehicles",
    words: [
      { word: "boat", marker: [4, 1, 7, 1] },
      { word: "car", marker: [6, 0, 6, 2] },
      { word: "train", marker: [1, 5, 5, 5] },
      { word: "ship", marker: [7, 4, 7, 7] },
      { word: "bicycle", marker: [1, 3, 7, 3] },
      { word: "van", marker: [0, 0, 0, 2] },
      { word: "tractor", marker: [0, 7, 6, 7] },
      { word: "aeroplane", marker: [8, 0, 8, 8] },
      { word: "truck", marker: [2, 6, 6, 6] },
      { word: "bus", marker: [3, 0, 5, 0] },
    ],
    showWords: true,
    lang: "en",
    desc: "Find the vehicles given at the bottom.",
    table: `VWSBUSCKA
    AKTFBOATE
    NTWAAKRNR
    LBICYCLEO
    PWMEHCFSP
    JTRAINBHL
    AOTRUCKIA
    TRACTORPN
    CQEDKXOEE`,
  },
  {
    slug: "colors",
    words: [
      { word: "pink", marker: [4, 7, 7, 7] },
      { word: "black", marker: [7, 3, 7, 7] },
      { word: "white", marker: [2, 1, 6, 5] },
      { word: "blue", marker: [3, 5, 6, 5] },
      { word: "green", marker: [6, 3, 6, 7] },
      { word: "purple", marker: [0, 1, 5, 6] },
      { word: "violet", marker: [0, 2, 0, 7] },
      { word: "yellow", marker: [2, 0, 7, 0] },
      { word: "red", marker: [2, 3, 2, 5] },
    ],
    showWords: true,
    lang: "en",
    desc: "Find the colors given at the bottom.",
    table: `NLYELLOW
    PGWHENMX
    VUDHJDFW
    IORXIVGB
    ODEPRTRL
    LNDBLUEA
    EVXXEEEC
    TRJRPINK`,
  },
  {
    slug: "profession",
    words: [
      { word: "scientist", marker: [0, 5, 8, 5] },
      { word: "teacher", marker: [3, 0, 3, 6] },
      { word: "farmer", marker: [2, 2, 7, 2] },
      { word: "police", marker: [1, 1, 1, 6] },
      { word: "cook", marker: [1, 5, 4, 8] },
      { word: "doctor", marker: [8, 2, 8, 7] },
      { word: "driver", marker: [6, 3, 6, 8] },
      { word: "nurse", marker: [0, 0, 0, 4] },
      { word: "tailor", marker: [3, 0, 8, 0] },
      { word: "pilot", marker: [0, 7, 4, 7] },
    ],
    showWords: true,
    lang: "en",
    desc: "Find the jobs given at the bottom.",
    table: `NXCTAILOR
    UPOEEZPZU
    ROFARMERD
    SLGCZVDIO
    EIPHGNRQC
    SCIENTIST
    SEORXYVLO
    PILOTKEJR
    MDZPKTRZB`,
  },
  {
    slug: "fruits",
    words: [
      { word: "apple", marker: [4, 2, 8, 2] },
      { word: "orange", marker: [4, 0, 4, 5] },
      { word: "grape", marker: [4, 4, 8, 4] },
      { word: "tomato", marker: [3, 0, 8, 0] },
      { word: "banana", marker: [3, 1, 8, 6] },
      { word: "mango", marker: [0, 7, 4, 7] },
      { word: "melon", marker: [0, 3, 4, 3] },
      { word: "pears", marker: [1, 2, 1, 6] },
      { word: "guava", marker: [4, 4, 8, 8] },
      { word: "papaya", marker: [2, 9, 7, 9] },
    ],
    showWords: true,
    lang: "en",
    desc: "Find the fruits given at the bottom.",
    table: `ZZHTOMATO
    NORBROYYW
    GPBKAPPLE
    MELONNFBL
    BAYRGRAPE
    URSOEUHNU
    CSLDUHAUA
    MANGOKPVP
    MXJBUZWTA
    FBPAPAYAR`,
  },
  {
    slug: "விலங்குகள்",
    words: [
      { word: "சிங்கம்", marker: [2, 0, 5, 0] },
      { word: "சிறுத்தை ", marker: [2, 0, 2, 3] },
      { word: "ஆடு", marker: [3, 2, 4, 2] },
      { word: "மாடு", marker: [4, 1, 4, 2] },
      { word: "நாய்", marker: [0, 1, 1, 1] },
      { word: "ஒட்டகம்", marker: [2, 6, 6, 6] },
      { word: "புலி ", marker: [6, 3, 6, 4] },
      { word: "பூனை ", marker: [6, 5, 7, 5] },
      { word: "நரி", marker: [4, 7, 5, 7] },
      { word: "கரடி", marker: [3, 3, 5, 5] },
      { word: "குதிரை ", marker: [2, 4, 0, 6] },
      { word: "கழுதை ", marker: [5, 1, 7, 3] },
    ],
    showWords: true,
    lang: "ta",
    desc: "ஒளிந்திருக்கும் விலங்குகளை கண்டுபிடிக்கவும்",
    table: `தெறசிங்கம்சர்
    நாய்றுசுமாகத்டீ
    ழ்ட்த்ஆடுழ்ழுபு
    சதுதைகழ்டபுதை
    பசகுடிரல்லில
    நதிழசுவ்டிபூனை
    ரைவஒட்டகம்த
    பஙசிகேநரிந்நி`,
  },
  {
    slug: "தமிழ்",
    words: [
      { word: "சேவல்", marker: [5, 0, 7, 0] },
      { word: " சக்கரம்", marker: [7, 2, 7, 6] },
      { word: "ஓடம்", marker: [5, 6, 7, 6] },
      { word: " பட்டம்", marker: [6, 4, 6, 7] },
      { word: "ஔவையார்", marker: [1, 1, 4, 4] },
      { word: "நாற்று", marker: [0, 0, 0, 2] },
      { word: " ஊஞ்சல்", marker: [3, 0, 0, 3] },
      { word: " சங்கு ", marker: [2, 7, 4, 7] },
      { word: "அன்னம்", marker: [3, 4, 0, 7] },
      { word: "பந்து", marker: [1, 3, 3, 5] },
      { word: "தாழ்ப்பாள்", marker: [5, 1, 5, 5] },
      { word: "மூட்டை", marker: [2, 0, 4, 2] },
    ],
    showWords: true,
    lang: "ta",
    desc: "கீழ் காணும் வார்த்தைகளை கண்டுபிடிக்கவும் ",
    table: `நாகிமூஊகிசேவல்
    ற்ஔஞ்ட்யதாகிய
    றுசவைங்டைழ்நிச
    ல்பலயாரப்ங்க்
    ய்குந்அர்பாபக
    வ்ங்ன்துகள்ட்ர
    மனடநித்ஓடம்
    ம்லசங்குழ்ம்சி`,
  },
];

/*
let modified = data.map((wordsearch) => ({
  words: wordsearch.words.map((item) => ({
    word: item.word,
    marker: item.marker,
  })),
  showWords: wordsearch.showWords,
  lang: wordsearch.lang,
  desc: wordsearch.desc,
  //table: `${wordsearch.table.map((item) => item.join("")).join("\n")}`,
  table: wordsearch.table,
}));

*/

export default data;
