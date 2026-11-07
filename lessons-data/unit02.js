/* Unit 2 · The N5 core · levels 11–20 */
window.KOTOBA_LESSONS = (window.KOTOBA_LESSONS || []).concat([
  {
    n: 11, jlpt: 'N5', title: 'A is B: です and じゃない',
    can: 'say what something is, and what it is not, politely.',
    pattern: 'A は B です。／ A は B じゃないです。',
    explain: 'です is the polite “is”. Its negative is じゃないです (or the more formal ではありません). The particle は marks the topic and is read “wa”. In Kansai casual speech, です becomes や, and じゃない becomes ちゃう or とちがう.',
    ex: [
      { jp: 'わたしは がくせいです。', kanji: '私は学生です。', en: 'I am a student.', ks: 'わたし、がくせいやで。' },
      { jp: 'これは ほんじゃないです。', kanji: 'これは本じゃないです。', en: 'This is not a book.', ks: 'これ、ほん ちゃうで。' },
      { jp: 'ここは えきです。', kanji: 'ここは駅です。', en: 'This place is the station.', ks: 'ここ、えきやで。' }
    ],
    words: [['がくせい', 'がくせい', 'student'], ['せんせい', 'せんせい', 'teacher'], ['ほん', 'ほん', 'book'], ['えき', 'えき', 'station']],
    drill: 'Say “I am not a teacher” politely, then in Osaka casual speech.',
    answer: 'わたしは せんせいじゃないです。／ わたし、せんせいと ちがうで。',
    curious: 'The は particle is written は but read わ. It is one of the clearest examples of Japanese spelling preserving an older pronunciation.'
  },
  {
    n: 12, jlpt: 'N5', title: 'This, that, and which',
    can: 'point to things near you, near the listener, and far away.',
    pattern: 'これ ・ それ ・ あれ ・ どれ',
    explain: 'The こ／そ／あ／ど set is a machine: これ this, それ that near you, あれ that over there, どれ which. Add の to attach a noun: この ほん (this book). Kansai uses the same set; in fast speech, それ can sound like そら.',
    ex: [
      { jp: 'これは なんですか。', kanji: 'これは何ですか。', en: 'What is this?', ks: 'これ、なん？' },
      { jp: 'それは おみやげです。', kanji: 'それはお土産です。', en: 'That is a souvenir.', ks: 'それ、おみやげやで。' },
      { jp: 'あれは どこですか。', kanji: 'あれはどこですか。', en: 'Where is that over there?', ks: 'あれ、どこや？' }
    ],
    words: [['これ', 'これ', 'this'], ['それ', 'それ', 'that (near you)'], ['あれ', 'あれ', 'that (over there)'], ['どれ', 'どれ', 'which']],
    drill: 'You hold a map. Ask “What is this?” and then “Which is the station?”',
    answer: 'これは なんですか。えきは どれですか。',
    curious: 'Japanese speakers often point with an open hand rather than one finger. The words do the pointing, and the gesture stays soft.'
  },
  {
    n: 13, jlpt: 'N5', title: 'There is: あります and います',
    can: 'say that a place has something, or that a person or animal is somewhere.',
    pattern: '〜が あります ／ 〜が います',
    explain: 'Use あります for things and います for people and animals. The thing that exists is marked with が. To ask a location, use どこに ありますか. Kansai keeps the same distinction; the casual form is ある／おる.',
    ex: [
      { jp: 'トイレは どこに ありますか。', en: 'Where is the toilet?', ks: 'トイレは どこに あるん？' },
      { jp: 'ここに コーヒーが あります。', en: 'There is coffee here.', ks: 'ここに コーヒーが あるで。' },
      { jp: 'ねこが います。', kanji: '猫がいます。', en: 'There is a cat.', ks: 'ねこが いるで。' }
    ],
    words: [['あります', 'あります', 'there is (thing)'], ['います', 'います', 'there is (person/animal)'], ['どこ', 'どこ', 'where'], ['トイレ', 'トイレ', 'toilet']],
    drill: 'Ask whether there is a convenience store near the station.',
    answer: 'えきの ちかくに コンビニが ありますか。',
    curious: 'Kansai often uses おる for people where standard uses いる: せんせいは おる？ This is not rude in Kansai, but it can sound rough if you use it in Tokyo.'
  },
  {
    n: 14, jlpt: 'N5', title: 'い-adjectives',
    can: 'describe food, weather and prices with い-adjectives.',
    pattern: 'おいしい ・ たかい ・ あつい ・ さむい',
    explain: 'い-adjectives end in い and conjugate directly: おいしい → おいしくない (not tasty). They can come before a noun (おいしい ラーメン) or at the end of a sentence (ラーメンは おいしいです). Kansai often prefers うまい for tasty and adds で or わ at the end.',
    ex: [
      { jp: 'この ラーメンは おいしいです。', kanji: 'このラーメンはおいしいです。', en: 'This ramen is delicious.', ks: 'この ラーメン、うまいで。' },
      { jp: 'きょうは あついですね。', kanji: '今日は暑いですね。', en: 'It is hot today, isn’t it?', ks: 'きょうは あついなあ。' },
      { jp: 'ちょっと たかいです。', kanji: 'ちょっと高いです。', en: 'It is a little expensive.', ks: 'ちょっと たかいわ。' }
    ],
    words: [['おいしい', 'おいしい', 'delicious'], ['たかい', 'たかい', 'expensive / tall'], ['あつい', 'あつい', 'hot'], ['さむい', 'さむい', 'cold']],
    drill: 'Say “This shop is cheap, but the coffee is delicious.”',
    answer: 'この みせは やすいですが、コーヒーは おいしいです。',
    curious: 'たかい means both “expensive” and “tall”. Context decides. A tall building and an expensive bag use the same adjective, and nobody is confused.'
  },
  {
    n: 15, jlpt: 'N5', title: 'な-adjectives and すき',
    can: 'describe places and say what you like and dislike.',
    pattern: 'しずかな まち ・ べんりです ・ 〜が すきです',
    explain: 'な-adjectives do not end in い. Before a noun they take な: しずかな へや. At the end they behave like nouns: しずかです. すき (“liked”) and きらい (“disliked”) are な-adjectives, and the thing you like takes が, not を.',
    ex: [
      { jp: 'この まちは しずかです。', kanji: 'この町は静かです。', en: 'This town is quiet.', ks: 'この まち、しずかやで。' },
      { jp: 'コーヒーが すきです。', kanji: 'コーヒーが好きです。', en: 'I like coffee.', ks: 'コーヒーが すきやねん。' },
      { jp: 'ここは あまり べんりじゃないです。', kanji: 'ここはあまり便利じゃないです。', en: 'This place is not very convenient.', ks: 'ここ、あんまり べんり ちゃうで。' }
    ],
    words: [['しずか', 'しずか', 'quiet'], ['べんり', 'べんり', 'convenient'], ['すき', 'すき', 'liked'], ['きらい', 'きらい', 'disliked']],
    drill: 'Say “I like quiet towns” and “I do not like noisy shops.”',
    answer: 'しずかな まちが すきです。うるさい みせは すきじゃないです。',
    curious: 'すき is literally “liked”, not “like”. Japanese describes the object as the thing that is liked, which is why が feels natural: コーヒーが すきです.'
  },
  {
    n: 16, jlpt: 'N5', title: 'Polite verbs: ます and ません',
    can: 'say what you do, do not do, and ask a polite question.',
    pattern: 'たべます ・ たべません ・ たべますか',
    explain: 'The polite verb ending ます covers the present and the future. The negative is ません. To ask a question, add か and a rising intonation. Japanese often drops the subject once it is clear, so たべます can mean “I eat”, “you eat” or “we eat” depending on context.',
    ex: [
      { jp: 'あさごはんを たべます。', kanji: '朝ごはんを食べます。', en: 'I eat breakfast.', ks: 'あさごはん たべるで。' },
      { jp: 'おさけを のみません。', kanji: 'お酒を飲みません。', en: 'I do not drink alcohol.', ks: 'おさけ、のまへん。' },
      { jp: 'あした いきますか。', kanji: '明日行きますか。', en: 'Are you going tomorrow?', ks: 'あした いく？' }
    ],
    words: [['たべます', 'たべます', 'eat'], ['のみます', 'のみます', 'drink'], ['いきます', 'いきます', 'go'], ['きます', 'きます', 'come']],
    drill: 'Say “I do not eat meat” and “Do you drink coffee?”',
    answer: 'にくを たべません。コーヒーを のみますか。',
    curious: 'The ます form is safe, but it can feel distant among friends. Kansai casual speech often drops it entirely: たべる？ のむ？ The room decides the formality.'
  },
  {
    n: 17, jlpt: 'N5', title: 'The を particle',
    can: 'mark the thing that receives an action.',
    pattern: 'コーヒーを のみます ・ ほんを よみます',
    explain: 'を marks the direct object. It is pronounced “o”, the same as the vowel. The verb comes at the end, so the object arrives before you know the action. Listen to the whole sentence before translating. Kansai uses the same を, though casual speech sometimes drops it.',
    ex: [
      { jp: 'コーヒーを のみます。', kanji: 'コーヒーを飲みます。', en: 'I drink coffee.', ks: 'コーヒー のむで。' },
      { jp: 'ほんを よみます。', kanji: '本を読みます。', en: 'I read a book.', ks: 'ほん、よむで。' },
      { jp: 'しんぶんを かいます。', kanji: '新聞を買います。', en: 'I buy a newspaper.', ks: 'しんぶん かうで。' }
    ],
    words: [['のみます', 'のみます', 'drink'], ['よみます', 'よみます', 'read'], ['かいます', 'かいます', 'buy'], ['しんぶん', 'しんぶん', 'newspaper']],
    drill: 'Make three sentences with を: coffee, a book, a ticket.',
    answer: 'コーヒーを のみます。ほんを よみます。きっぷを かいます。',
    curious: 'を is the only hiragana used almost exclusively as a particle. You will rarely see it inside a normal word, which makes it a useful signpost in a sentence.'
  },
  {
    n: 18, jlpt: 'N5', title: 'Going to, being at, meeting at',
    can: 'use へ for direction, で for the place of an action, and に for time or destination.',
    pattern: 'がっこうへ いきます ・ えきで あいます ・ しちじに おきます',
    explain: 'へ (pronounced “e”) points the direction. で marks where an action happens. に marks a destination, a time, or the person you meet. They overlap at the edges, so learn them in whole phrases rather than as one-to-one translations.',
    ex: [
      { jp: 'あした とうきょうへ いきます。', kanji: '明日東京へ行きます。', en: 'I am going to Tokyo tomorrow.', ks: 'あした とうきょうに いくで。' },
      { jp: 'えきで ともだちに あいます。', kanji: '駅で友だちに会います。', en: 'I will meet a friend at the station.', ks: 'えきで ともだちに あうで。' },
      { jp: 'しちじに おきます。', kanji: '七時に起きます。', en: 'I get up at seven.', ks: 'しちじに おきるで。' }
    ],
    words: [['へ', 'へ', 'toward'], ['で', 'で', 'at / by means of'], ['に', 'に', 'to / at (time)'], ['あいます', 'あいます', 'meet']],
    drill: 'Say “I go to school by bicycle at eight.”',
    answer: 'はちじに じてんしゃで がっこうへ いきます。',
    curious: 'へ is written へ but pronounced “e” as a particle. Like は and を, it is a spelling that remembers an older sound.'
  },
  {
    n: 19, jlpt: 'N5', title: 'Please do: 〜てください',
    can: 'ask for something politely, and soften the request.',
    pattern: 'みずを ください ・ ちょっと まってください',
    explain: 'ください means “please give me” after a noun, and “please do” after a て-form. みずを ください is “water, please”. ちょっと まってください is “please wait a moment”. Kansai’s たのんます and 〜てくれへん are softer, more local ways to ask.',
    ex: [
      { jp: 'みずを ください。', kanji: '水をください。', en: 'Water, please.', ks: 'おみず、たのんます。' },
      { jp: 'ちょっと まってください。', kanji: 'ちょっと待ってください。', en: 'Please wait a moment.', ks: 'ちょっと まってくれへん？' },
      { jp: 'ゆっくり はなしてください。', kanji: 'ゆっくり話してください。', en: 'Please speak slowly.', ks: 'ゆっくり はなしてな。' }
    ],
    words: [['ください', 'ください', 'please give / please do'], ['まって', 'まって', 'wait (te-form)'], ['みず', 'みず', 'water'], ['ゆっくり', 'ゆっくり', 'slowly']],
    drill: 'Ask a shop assistant to show you that bag, politely.',
    answer: 'その かばんを みせてください。',
    curious: 'A bare ください can sound blunt. Adding すみません or ちょっと at the front softens it: すみません、ちょっと おみずを ください.'
  },
  {
    n: 20, jlpt: 'N5', title: 'Yesterday and last week',
    can: 'talk about the past with 〜ました and 〜でした.',
    pattern: 'たべました ・ いきました ・ おいしかったです',
    explain: 'Polite past verbs end in ました: たべました, いきました. The negative past is ませんでした. い-adjectives change internally: おいしい → おいしかったです. な-adjectives and nouns use でした: しずかでした.',
    ex: [
      { jp: 'きのう すしを たべました。', kanji: '昨日寿司を食べました。', en: 'I ate sushi yesterday.', ks: 'きのう すし たべたで。' },
      { jp: 'せんしゅう とうきょうへ いきました。', kanji: '先週東京へ行きました。', en: 'I went to Tokyo last week.', ks: 'せんしゅう とうきょうへ いったで。' },
      { jp: 'その みせの りょうりは おいしかったです。', kanji: 'その店の料理はおいしかったです。', en: 'The food at that shop was delicious.', ks: 'その みせの りょうり、うまかったで。' }
    ],
    words: [['きのう', 'きのう', 'yesterday'], ['せんしゅう', 'せんしゅう', 'last week'], ['たべました', 'たべました', 'ate'], ['いきました', 'いきました', 'went']],
    drill: 'Say “Last week I went to Osaka and ate takoyaki.”',
    answer: 'せんしゅう おおさかに いきました。たこやきを たべました。',
    curious: 'Japanese often uses the past form even for something that just happened: たべました. The exact English tense (“ate” or “have eaten”) is supplied by context, not by a separate perfect tense.'
  }
]);
