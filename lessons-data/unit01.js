/* Unit 1 · Sounds and first words · levels 1–10 */
window.KOTOBA_LESSONS = (window.KOTOBA_LESSONS || []).concat([
  {
    n: 1, jlpt: 'Pre-N5', title: 'The five vowels',
    can: 'pronounce あ い う え お cleanly and hear them in real words.',
    pattern: 'あ ・ い ・ う ・ え ・ お',
    explain: 'Japanese has five short vowels, and they do not slide into each other the way English vowels do. Keep the mouth still for each one. あ is open, い is spread, う is loose and unrounded, え is in between, お is round but not deep. Say them five times slowly, then use them in words.',
    ex: [
      { jp: 'あお', kanji: '青', en: 'blue', romaji: 'a-o' },
      { jp: 'いえ', kanji: '家', en: 'house', romaji: 'i-e' },
      { jp: 'うえ', kanji: '上', en: 'above', romaji: 'u-e' }
    ],
    words: [['あお', 'あお', 'blue'], ['いえ', 'いえ', 'house'], ['うえ', 'うえ', 'above'], ['おおきい', 'おおきい', 'big']],
    drill: 'Read this row aloud, keeping every vowel short and separate: あえいうお. Then say あお, いえ, うえ without pausing between the vowels.',
    answer: 'あお (a-o), いえ (i-e), うえ (u-e). Two beats each, not one sliding sound.',
    curious: 'The Japanese う is not the English “oo”. Your lips stay relaxed and barely round — listen for the difference in うえ and うう.'
  },
  {
    n: 2, jlpt: 'Pre-N5', title: 'Beat, long vowel, small っ',
    can: 'hear the difference between a short sound, a held sound and a one-beat silence.',
    pattern: 'おばさん → おばあさん ・ きて → きって',
    explain: 'Japanese is timed in beats called mora. A long vowel is two beats; the small っ is one beat of silence. These are not decoration: they change the word. おばさん is aunt, おばあさん is grandmother. きて is “come”, きって is a postage stamp.',
    ex: [
      { jp: 'おばあさん', kanji: 'お祖母さん', en: 'grandmother', romaji: 'o-ba-a-sa-n' },
      { jp: 'きって', kanji: '切手', en: 'postage stamp', romaji: 'ki · pause · te' },
      { jp: 'がっこう', kanji: '学校', en: 'school', romaji: 'ga · pause · ko-o' }
    ],
    words: [['おばさん', 'おばさん', 'aunt'], ['おばあさん', 'おばあさん', 'grandmother'], ['きて', 'きて', 'come (and…)'], ['きって', 'きって', 'postage stamp']],
    drill: 'Clap once per beat: お・ば・あ・さ・ん. Then き・っ・て. Which one has a silent beat?',
    answer: 'きって has the silent beat in the middle. Hold it, then release て.',
    curious: 'Japanese children practise っ with games because the pause is a real sound. If your きって sounds like きて, a listener may hear “come” instead of “stamp”.'
  },
  {
    n: 3, jlpt: 'Pre-N5', title: 'Hiragana: ka and sa rows',
    can: 'read and write か き く け こ and さ し す せ そ.',
    pattern: 'か き く け こ ／ さ し す せ そ',
    explain: 'Hiragana is the native syllabary: one shape, one sound. Learn it in rows of five. Write each character large, then small, saying the sound out loud each time. し is “shi”, not “si”; す is a light “su”, not “soo”.',
    ex: [
      { jp: 'かお', kanji: '顔', en: 'face', romaji: 'ka-o' },
      { jp: 'すし', kanji: '寿司', en: 'sushi', romaji: 'su-shi' },
      { jp: 'せかい', kanji: '世界', en: 'world', romaji: 'se-ka-i' }
    ],
    words: [['かお', 'かお', 'face'], ['きく', 'きく', 'listen'], ['すし', 'すし', 'sushi'], ['せかい', 'せかい', 'world']],
    drill: 'Write か き く け こ five times, saying each sound. Then read かお, きく, すし, せかい.',
    answer: 'ka-o, ki-ku, su-shi, se-ka-i. Keep the vowels short.',
    curious: 'Hiragana was originally a cursive shorthand for kanji. The rounded shapes are a writing system built for speed with a brush — and they still reward a flowing hand.'
  },
  {
    n: 4, jlpt: 'Pre-N5', title: 'Hiragana: ta and na rows',
    can: 'read た ち つ て と and な に ぬ ね の inside short words.',
    pattern: 'た ち つ て と ／ な に ぬ ね の',
    explain: 'Two sounds need extra care: ち is “chi”, and つ is “tsu”, made by briefly touching the tongue behind the top teeth. ぬ and ね differ only by the final loop; slow writing fixes them faster than fast writing.',
    ex: [
      { jp: 'たこ', kanji: '蛸', en: 'octopus', romaji: 'ta-ko' },
      { jp: 'ねこ', kanji: '猫', en: 'cat', romaji: 'ne-ko' },
      { jp: 'なつ', kanji: '夏', en: 'summer', romaji: 'na-tsu' }
    ],
    words: [['たこ', 'たこ', 'octopus'], ['ねこ', 'ねこ', 'cat'], ['なつ', 'なつ', 'summer'], ['とり', 'とり', 'bird']],
    drill: 'Circle every つ and ち in this line: ちかてつで とうきょうへ いきます。',
    answer: 'ちかてつ (subway) has ち and つ. とうきょう has no ち or つ. Read it: chi-ka-te-tsu de Tōkyō e i-ki-ma-su.',
    curious: 'たこ means octopus, but たこ焼き (takoyaki) is the Osaka street food that made the word famous worldwide. You will meet it again in Unit 3.'
  },
  {
    n: 5, jlpt: 'Pre-N5', title: 'Hiragana: the rest of the chart',
    can: 'read the は, ま, や, ら and わ rows, plus ん.',
    pattern: 'は ひ ふ へ ほ ／ ま み む め も ／ や ゆ よ ／ ら り る れ ろ ／ わ を ん',
    explain: 'The last rows complete the chart. ふ is not “fu” with English teeth on lips; it is a soft puff between the lips. を is used only as a particle, and ん is a full beat of its own. At this point you can read any hiragana word, even if you do not know it yet.',
    ex: [
      { jp: 'はな', kanji: '花', en: 'flower', romaji: 'ha-na' },
      { jp: 'やま', kanji: '山', en: 'mountain', romaji: 'ya-ma' },
      { jp: 'わたし', kanji: '私', en: 'I / me', romaji: 'wa-ta-shi' }
    ],
    words: [['はな', 'はな', 'flower'], ['やま', 'やま', 'mountain'], ['わたし', 'わたし', 'I'], ['みず', 'みず', 'water']],
    drill: 'Read the whole row without romaji: はひふへほ まみむめも やゆよ らりるれろ わをん.',
    answer: 'ha hi fu he ho / ma mi mu me mo / ya yu yo / ra ri ru re ro / wa o n. The を is read “o” here.',
    curious: 'The particle を is pronounced “o” but written を. Japanese keeps the old spelling because the writing system remembers history that the voice has already smoothed away.'
  },
  {
    n: 6, jlpt: 'Pre-N5', title: 'Voiced sounds and small や',
    can: 'read が ざ だ ば ぱ and combinations such as きゃ しゅ ちょ.',
    pattern: 'が ぎ ぐ げ ご ・ きゃ きゅ きょ',
    explain: 'Two small marks (゛) voice a consonant: か → が, さ → ざ, た → だ, は → ば. A small circle (゜) makes the p row: は → ぱ. A small や, ゆ or よ glides the previous sound into one beat: きゃ is “kya”, not “ki-ya”.',
    ex: [
      { jp: 'がっこう', kanji: '学校', en: 'school', romaji: 'ga · pause · ko-o' },
      { jp: 'じてんしゃ', kanji: '自転車', en: 'bicycle', romaji: 'ji-te-n-sha' },
      { jp: 'きょう', kanji: '今日', en: 'today', romaji: 'kyo-o' }
    ],
    words: [['がっこう', 'がっこう', 'school'], ['じてんしゃ', 'じてんしゃ', 'bicycle'], ['きょう', 'きょう', 'today'], ['ぱん', 'ぱん', 'bread']],
    drill: 'Which is one beat: きや or きゃ? Say both, then compare きょ and きよ. Finally, say きょう as two beats: きょ・う.',
    answer: 'きゃ is one beat. きや is two. きょう is two beats: kyo-o.',
    curious: 'The small や combinations are a favourite of dialect spelling. Kansai’s 〜やん and 〜やろ are written with full や, but the glide still changes the rhythm of the sentence.'
  },
  {
    n: 7, jlpt: 'Pre-N5', title: 'Katakana and loanwords',
    can: 'recognise the katakana shapes for coffee, bread, hotel and taxi.',
    pattern: 'コーヒー ・ パン ・ ホテル ・ タクシー',
    explain: 'Katakana is the same 46 sounds in angular shapes. It marks loanwords, foreign names, sound effects and emphasis. The long vowel mark ー holds the previous vowel for one more beat: コーヒー is ko-o-hi-i, four beats.',
    ex: [
      { jp: 'コーヒー', en: 'coffee', romaji: 'ko-o-hi-i' },
      { jp: 'パン', en: 'bread', romaji: 'pa-n' },
      { jp: 'ホテル', en: 'hotel', romaji: 'ho-te-ru' }
    ],
    words: [['コーヒー', 'コーヒー', 'coffee'], ['パン', 'パン', 'bread'], ['ホテル', 'ホテル', 'hotel'], ['タクシー', 'タクシー', 'taxi']],
    drill: 'Find the long vowel in コーヒー and タクシー. Clap the beats.',
    answer: 'コーヒー: ko-o-hi-i (4). タクシー: ta-ku-shi-i (4). The ー adds the final beat.',
    curious: 'パン came from Portuguese pão in the sixteenth century. Japanese has been borrowing and reshaping foreign words for centuries — loanwords are not a modern invasion.'
  },
  {
    n: 8, jlpt: 'Pre-N5', title: 'Greetings for the time of day',
    can: 'greet someone in the morning, afternoon and evening, and thank them.',
    pattern: 'おはようございます ・ こんにちは ・ こんばんは ・ ありがとうございます',
    explain: 'Greetings are the first place where standard and Kansai part company. Use the standard polite forms with people you do not know. The Kansai examples have different social settings: まいど is associated with shops and familiar customers, not a general replacement for こんにちは. おおきに is a regional way to thank someone; many Osaka speakers also use ありがとう.',
    ex: [
      { jp: 'おはようございます', en: 'Good morning (polite)', ks: 'おはようさん。', romaji: 'ohayō gozaimasu' },
      { jp: 'こんにちは', en: 'Hello / good afternoon', ks: 'まいど。', romaji: 'konnichiwa' },
      { jp: 'ありがとうございます', en: 'Thank you (polite)', ks: 'おおきに', romaji: 'arigatō gozaimasu' }
    ],
    words: [['おはよう', 'おはよう', 'good morning (casual)'], ['こんばんは', 'こんばんは', 'good evening'], ['ありがとう', 'ありがとう', 'thanks (casual)'], ['おおきに', 'おおきに', 'thank you (Kansai)']],
    drill: 'It is 9 a.m. at a hotel. Greet the receptionist, then thank them. Which forms do you choose?',
    answer: 'おはようございます。ありがとうございます。Keep the polite forms; save おおきに for a friendlier, local moment.',
    curious: 'こんにちは is written with は, not わ, because it began as the beginning of a longer sentence: “Today is…”. The particle spelling stayed even after the phrase shortened.'
  },
  {
    n: 9, jlpt: 'Pre-N5', title: 'Introduce yourself',
    can: 'give your name, where you are from, and one thing you like.',
    pattern: 'わたしは ___ です。___ から きました。',
    explain: 'The basic introduction is three moves: name, origin, closing. わたしは Alex です。アメリカ から きました。よろしく おねがいします。 Kansai swaps です for や/やで and きました for きたんや in casual speech. Do not stack too many polite forms; three clear sentences are stronger than a long speech.',
    ex: [
      { jp: 'わたしは アレックスです。', kanji: '私はアレックスです。', en: 'I am Alex.', ks: 'わたしは アレックスや。', romaji: 'watashi wa Arekkusu desu.' },
      { jp: 'アメリカから きました。', kanji: 'アメリカから来ました。', en: 'I came from America.', ks: 'アメリカから きたで。', romaji: 'Amerika kara kimashita.' },
      { jp: 'にほんごを べんきょうしています。', kanji: '日本語を勉強しています。', en: 'I am studying Japanese.', ks: 'にほんごを べんきょうしとるんや。', romaji: 'Nihongo o benkyō shite imasu.' }
    ],
    words: [['わたし', 'わたし', 'I'], ['なまえ', 'なまえ', 'name'], ['にほん', 'にほん', 'Japan'], ['べんきょう', 'べんきょう', 'study']],
    drill: 'Introduce yourself in three sentences: name, country, one thing you like. Say it aloud twice.',
    answer: 'わたしは ___ です。___ から きました。___ が すきです。よろしく おねがいします。',
    curious: 'Japanese often drops わたし once the topic is clear. Saying it in every sentence sounds heavy, as if you are pointing at yourself each time.'
  },
  {
    n: 10, jlpt: 'Pre-N5', title: 'Numbers, prices and いくら',
    can: 'count from one to ten, ask a price, and understand the answer.',
    pattern: 'いくらですか ／ なんぼですか',
    explain: 'Learn the first ten numbers as a song, then attach them to money. いくらですか is the portable standard question. In Osaka, なんぼですか is the everyday shop question, and なんぼ？ is the casual version between friends.',
    ex: [
      { jp: 'これは いくらですか。', kanji: 'これはいくらですか。', en: 'How much is this?', ks: 'これ、いくら？', romaji: 'kore wa ikura desu ka.' },
      { jp: 'さんびゃくえんです。', kanji: '三百円です。', en: 'It is 300 yen.', ks: 'さんびゃくえんやで。', romaji: 'sanbyaku en desu.' },
      { jp: 'ぜんぶで せんえんです。', kanji: '全部で千円です。', en: 'It is 1,000 yen altogether.', ks: 'ぜんぶで せんえんやで。', romaji: 'zenbu de sen en desu.' }
    ],
    words: [['いち', 'いち', 'one'], ['に', 'に', 'two'], ['さん', 'さん', 'three'], ['えん', 'えん', 'yen']],
    drill: 'Ask the price of a notebook, then say “I’ll take it” using これを ください.',
    answer: 'これは いくらですか。… これを ください。In Osaka: これ、なんぼ？… これ、たのんます。',
    curious: 'Japanese prices are often said without です in shops: さんびゃくえん. The politeness lives in the tone and the closing, not in every noun.'
  }
]);
