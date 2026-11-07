/* Study-guide layer · Unit 1 · levels 1–10
   Adds vocabulary, kanji, a dialogue, a short reading and a
   checklist to each level. Core grammar stays in unit01.js. */
window.KOTOBA_GUIDE = window.KOTOBA_GUIDE || {};
Object.assign(window.KOTOBA_GUIDE, {
  1: {
    ref: 'Genki I · L0 · Minna 1',
    time: '20–25 min',
    vocab: [
      ['あお', '青', 'blue', 'noun'],
      ['いえ', '家', 'house', 'noun'],
      ['うえ', '上', 'above', 'noun'],
      ['えき', '駅', 'station', 'noun'],
      ['おと', '音', 'sound', 'noun'],
      ['あめ', '雨', 'rain', 'noun']
    ],
    kanji: [
      ['青', 'せい・あお', 'blue', 'あおい'],
      ['雨', 'う・あめ', 'rain', 'あめ']
    ],
    dialogue: [
      ['A', 'あ・い・う・え・お。', 'あ・い・う・え・お。', 'A, I, U, E, O.'],
      ['B', 'あ・い・う・え・お。', 'あ・い・う・え・お。', 'A, I, U, E, O.'],
      ['A', 'あめです。', 'あめや。', 'It is raining.'],
      ['B', 'はい、あめです。', 'せや、あめや。', 'Yes, it is raining.']
    ],
    reading: {
      jp: 'あおと あめ。いえと えき。',
      ks: 'あおと あめ。いえと えき。',
      en: 'Blue and rain. House and station.'
    },
    check: [
      'Say あ い う え お five times without sliding them together.',
      'Hear each vowel inside あお, いえ, うえ, おと.',
      'Recognise 青 and 雨 and read them as あお and あめ.'
    ]
  },
  2: {
    ref: 'Genki I · L0 · Minna 2',
    time: '20–25 min',
    vocab: [
      ['おばあさん', 'お祖母さん', 'grandmother', 'noun'],
      ['おばさん', '—', 'aunt', 'noun'],
      ['きって', '切手', 'postage stamp', 'noun'],
      ['きて', '来て', 'come (te-form)', 'verb'],
      ['がっこう', '学校', 'school', 'noun'],
      ['いってきます', '—', 'I am off', 'phrase']
    ],
    kanji: [
      ['学', 'がく・まなぶ', 'study', 'がっこう'],
      ['手', 'しゅ・て', 'hand', 'きって']
    ],
    dialogue: [
      ['A', 'きってを ください。', 'きって たのむわ。', 'A stamp, please.'],
      ['B', 'はい、きってです。', 'はい、きってやで。', 'Here is a stamp.'],
      ['A', 'ありがとうございます。', 'おおきに。', 'Thank you.'],
      ['B', 'どういたしまして。', 'どういたしまして。', 'You are welcome.']
    ],
    reading: {
      jp: 'おばあさんと がっこうへ いきます。',
      ks: 'おばあさんと がっこうへ いくで。',
      en: 'I go to school with my grandmother.'
    },
    check: [
      'Hear the difference between おばさん and おばあさん.',
      'Hear the small っ in きって and いってきます.',
      'Read 学校 as がっこう and 切手 as きって.'
    ]
  },
  3: {
    ref: 'Genki I · L1 · Minna 3',
    time: '25 min',
    vocab: [
      ['かお', '顔', 'face', 'noun'],
      ['くつ', '靴', 'shoes', 'noun'],
      ['さかな', '魚', 'fish', 'noun'],
      ['すし', '寿司', 'sushi', 'noun'],
      ['せかい', '世界', 'world', 'noun'],
      ['そと', '外', 'outside', 'noun']
    ],
    kanji: [
      ['顔', 'がん・かお', 'face', 'かお'],
      ['魚', 'ぎょ・さかな', 'fish', 'さかな']
    ],
    dialogue: [
      ['A', 'すしが すきです。', 'すしが すきやねん。', 'I like sushi.'],
      ['B', 'わたしも すしが すきです。', 'わしも すしが すきやで。', 'I like sushi too.'],
      ['A', 'じゃあ、いっしょに いきましょう。', 'ほな、いっしょに いこか。', 'Then let us go together.'],
      ['B', 'いいですね。', 'ええなあ。', 'That sounds good.']
    ],
    reading: {
      jp: 'わたしは すしと さかなを たべます。',
      ks: 'わたしは すしと さかなを たべるで。',
      en: 'I eat sushi and fish.'
    },
    check: [
      'Read the ka and sa rows without looking at romaji.',
      'Say さかな, すし, せかい with clean short vowels.',
      'Recognise 顔 and 魚 in a menu or a sign.'
    ]
  },
  4: {
    ref: 'Genki I · L1 · Minna 4',
    time: '25 min',
    vocab: [
      ['たこ', '蛸', 'octopus', 'noun'],
      ['ねこ', '猫', 'cat', 'noun'],
      ['なつ', '夏', 'summer', 'noun'],
      ['とり', '鳥', 'bird', 'noun'],
      ['にく', '肉', 'meat', 'noun'],
      ['なまえ', '名前', 'name', 'noun']
    ],
    kanji: [
      ['猫', 'びょう・ねこ', 'cat', 'ねこ'],
      ['夏', 'か・なつ', 'summer', 'なつ']
    ],
    dialogue: [
      ['A', 'ねこが いますね。', 'ねこが いるなあ。', 'There is a cat, is there not.'],
      ['B', 'ええ、うちの ねこです。', 'せや、うちの ねこや。', 'Yes, it is my cat.'],
      ['A', 'なまえは なんですか。', 'なまえは なん？', 'What is its name?'],
      ['B', 'たまです。', 'たまや。', 'It is Tama.']
    ],
    reading: {
      jp: 'なつに ねこが うちに きました。',
      ks: 'なつに ねこが うちに きたで。',
      en: 'A cat came to my house in summer.'
    },
    check: [
      'Read the ta and na rows aloud.',
      'Hear the short vowels in ねこ, たこ and なつ.',
      'Ask a name question with なまえは なんですか。'
    ]
  },
  5: {
    ref: 'Genki I · L1–2 · Minna 5',
    time: '25 min',
    vocab: [
      ['はな', '花', 'flower', 'noun'],
      ['やま', '山', 'mountain', 'noun'],
      ['よる', '夜', 'night', 'noun'],
      ['りんご', '林檎', 'apple', 'noun'],
      ['れきし', '歴史', 'history', 'noun'],
      ['わたし', '私', 'I, me', 'pronoun']
    ],
    kanji: [
      ['花', 'か・はな', 'flower', 'はな'],
      ['山', 'さん・やま', 'mountain', 'やま']
    ],
    dialogue: [
      ['A', 'やまに はなが さいています。', 'やまに はなが さいとるで。', 'Flowers are blooming on the mountain.'],
      ['B', 'きれいですね。', 'きれいやな。', 'They are beautiful.'],
      ['A', 'よるも きれいですよ。', 'よるも きれいやで。', 'They are beautiful at night too.'],
      ['B', 'じゃあ、よるに いきましょう。', 'ほな、よるに いこか。', 'Then let us go at night.']
    ],
    reading: {
      jp: 'よる、やまの はなが きれいです。',
      ks: 'よる、やまの はなが きれいや。',
      en: 'At night, the flowers on the mountain are beautiful.'
    },
    check: [
      'Read the whole hiragana chart once, slowly.',
      'Say はな, やま, よる without dropping the final vowel.',
      'Recognise 花 and 山 on a map or a sign.'
    ]
  },
  6: {
    ref: 'Genki I · L2 · Minna 6',
    time: '25 min',
    vocab: [
      ['がっこう', '学校', 'school', 'noun'],
      ['ぎゅうにゅう', '牛乳', 'milk', 'noun'],
      ['じてんしゃ', '自転車', 'bicycle', 'noun'],
      ['びょういん', '病院', 'hospital', 'noun'],
      ['ぱん', 'パン', 'bread', 'noun'],
      ['きゃく', '客', 'guest, customer', 'noun']
    ],
    kanji: [
      ['牛', 'ぎゅう・うし', 'cow', 'ぎゅうにゅう'],
      ['病', 'びょう・やまい', 'illness', 'びょういん']
    ],
    dialogue: [
      ['A', 'ぎゅうにゅうを のみますか。', 'ぎゅうにゅう のむ？', 'Do you drink milk?'],
      ['B', 'いいえ、こうちゃを のみます。', 'いや、こうちゃ のむわ。', 'No, I drink tea.'],
      ['A', 'じゃあ、こうちゃを ふたつ ください。', 'ほな、こうちゃ ふたつ たのむわ。', 'Then two teas, please.'],
      ['B', 'かしこまりました。', 'まいど。', 'Certainly.']
    ],
    reading: {
      jp: 'じてんしゃで びょういんへ いきます。',
      ks: 'じてんしゃで びょういんへ いくで。',
      en: 'I go to the hospital by bicycle.'
    },
    check: [
      'Hear the difference between がっこう and かっこう.',
      'Read きゃ, きゅ, きょ as one beat.',
      'Recognise 牛 and 病 in 牛乳 and 病院.'
    ]
  },
  7: {
    ref: 'Genki I · L2 · Minna 7',
    time: '25 min',
    vocab: [
      ['コーヒー', '—', 'coffee', 'noun'],
      ['パン', '—', 'bread', 'noun'],
      ['ホテル', '—', 'hotel', 'noun'],
      ['タクシー', '—', 'taxi', 'noun'],
      ['アメリカ', '—', 'America', 'place'],
      ['パーティー', '—', 'party', 'noun']
    ],
    kanji: [],
    dialogue: [
      ['A', 'ホテルまで タクシーで いきます。', 'ホテルまで タクシーで いくで。', 'I go to the hotel by taxi.'],
      ['B', 'どのくらい かかりますか。', 'どのくらい かかる？', 'How long does it take?'],
      ['A', 'せんえん くらいです。', 'せんえん くらいや。', 'About one thousand yen.'],
      ['B', 'じゃあ、おねがいします。', 'ほな、たのむわ。', 'Then please take me.']
    ],
    reading: {
      jp: 'あした、アメリカから ともだちが きます。',
      ks: 'あした、アメリカから ともだちが くるで。',
      en: 'Tomorrow a friend comes from America.'
    },
    check: [
      'Read コーヒー, パン, ホテル and タクシー without romaji.',
      'Hear the long ー in コーヒー and タクシー.',
      'Write your own name in katakana.'
    ]
  },
  8: {
    ref: 'Genki I · L1 · Minna 8',
    time: '20–25 min',
    vocab: [
      ['おはようございます', '—', 'good morning', 'greeting'],
      ['こんにちは', '—', 'hello, good afternoon', 'greeting'],
      ['こんばんは', '—', 'good evening', 'greeting'],
      ['ありがとうございます', '—', 'thank you', 'greeting'],
      ['すみません', '—', 'excuse me, sorry', 'greeting'],
      ['さようなら', '—', 'goodbye', 'greeting']
    ],
    kanji: [
      ['朝', 'ちょう・あさ', 'morning', 'あさ'],
      ['晩', 'ばん', 'evening', 'こんばんは']
    ],
    dialogue: [
      ['A', 'おはようございます。', 'おはようさん。', 'Good morning.'],
      ['B', 'おはようございます。', 'おはようさん。', 'Good morning.'],
      ['A', 'いい てんきですね。', 'ええ てんきやな。', 'Nice weather, is it not.'],
      ['B', 'ええ、さんぽに いきましょう。', 'せや、さんぽ いこか。', 'Yes, let us take a walk.']
    ],
    reading: {
      jp: 'あさは おはよう、よるは こんばんは。',
      ks: 'あさは おはようさん、よるは こんばんは。',
      en: 'In the morning, good morning; at night, good evening.'
    },
    check: [
      'Choose the right greeting for morning, afternoon and night.',
      'Say ありがとうございます and すみません at natural speed.',
      'Recognise 朝 and 晩 in 朝ごはん and 今晩.'
    ]
  },
  9: {
    ref: 'Genki I · L3 · Minna 9',
    time: '25–30 min',
    vocab: [
      ['わたし', '私', 'I, me', 'pronoun'],
      ['なまえ', '名前', 'name', 'noun'],
      ['くに', '国', 'country', 'noun'],
      ['しゅみ', '趣味', 'hobby', 'noun'],
      ['がくせい', '学生', 'student', 'noun'],
      ['かいしゃいん', '会社員', 'company worker', 'noun']
    ],
    kanji: [
      ['私', 'し・わたし', 'I, private', 'わたし'],
      ['名', 'めい・な', 'name', 'なまえ']
    ],
    dialogue: [
      ['A', 'はじめまして。わたしは アレックスです。', 'はじめまして。わたしは アレックスや。', 'How do you do. I am Alex.'],
      ['B', 'はじめまして。たなかです。', 'はじめまして。たなかや。', 'How do you do. I am Tanaka.'],
      ['A', 'アメリカから きました。', 'アメリカから きたで。', 'I came from America.'],
      ['B', 'よろしく おねがいします。', 'よろしゅう たのむわ。', 'Pleased to meet you.']
    ],
    reading: {
      jp: 'わたしは がくせいです。しゅみは おんがくです。',
      ks: 'わたしは がくせいや。しゅみは おんがくや。',
      en: 'I am a student. My hobby is music.'
    },
    check: [
      'Introduce yourself in three sentences without notes.',
      'Ask and answer おなまえは なんですか。',
      'Write 私 and 名 in the correct stroke order.'
    ]
  },
  10: {
    ref: 'Genki I · L3 · Minna 10',
    time: '25–30 min',
    vocab: [
      ['いち', '一', 'one', 'number'],
      ['に', '二', 'two', 'number'],
      ['さん', '三', 'three', 'number'],
      ['よん', '四', 'four', 'number'],
      ['ひゃく', '百', 'hundred', 'number'],
      ['せん', '千', 'thousand', 'number']
    ],
    kanji: [
      ['一', 'いち', 'one', 'いち'],
      ['百', 'ひゃく', 'hundred', 'ひゃく'],
      ['千', 'せん', 'thousand', 'せん']
    ],
    dialogue: [
      ['A', 'これは いくらですか。', 'これ、なんぼ？', 'How much is this?'],
      ['B', 'さんびゃくえんです。', 'さんびゃくえんやで。', 'It is three hundred yen.'],
      ['A', 'じゃあ、これを ください。', 'ほな、これ たのむわ。', 'Then I will take this.'],
      ['B', 'ありがとうございます。', 'おおきに。', 'Thank you.']
    ],
    reading: {
      jp: 'りんごは ひゃくえん、すしは せんえんです。',
      ks: 'りんごは ひゃくえん、すしは せんえんや。',
      en: 'An apple is one hundred yen; sushi is one thousand yen.'
    },
    check: [
      'Count from one to ten without pausing.',
      'Say prices up to 9,999 yen.',
      'Ask いくらですか。 and understand the answer.'
    ]
  }
});
