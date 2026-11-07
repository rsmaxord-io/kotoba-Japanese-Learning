/* ============================================================
   Kotoba — the textbook layer
   For every level: how the pattern is built, and the mistake
   learners actually make with it. Kept separate from unitNN.js
   so the sentence data stays clean.
   ============================================================ */
window.KOTOBA_TEXTBOOK = {

  1: {
    form: 'Five vowels, five moras: あ い う え お. Each one is short and pure.',
    pitfall: 'English speakers glide あ into え, or お into う. Keep the mouth still for the whole mora.'
  },
  2: {
    form: 'Long vowel: hold the vowel for two moras (おばあさん). Small っ: one mora of silence before the next sound (きって).',
    pitfall: 'A small っ is not a pause for breath, it is a beat. きて and きって differ in length, not in emphasis.'
  },
  3: {
    form: 'か row: か き く け こ. さ row: さ し す せ そ. し is “shi”, never “si”.',
    pitfall: 'す is made with unrounded lips. Do not round it into the “su” of English “soon”.'
  },
  4: {
    form: 'た row: た ち つ て と. な row: な に ぬ ね の. ち is “chi”, つ is “tsu”.',
    pitfall: 'つ is not “tu”. Put the tongue behind the top teeth and release a little air.'
  },
  5: {
    form: 'は row, ま row, や row (や ゆ よ), ら row, then わ を ん. The particle を is pronounced “o”.',
    pitfall: 'ら り る れ ろ is a single tongue tap, close to the “tt” in American “butter”, not an English “r”.'
  },
  6: {
    form: 'Voiced marks give が ざ だ ば; the semi-voiced mark gives ぱ. A small や/ゆ/よ after an i-row kana makes one mora: きゃ きゅ きょ.',
    pitfall: 'きゃ is one beat; きや is two. Do not slip a vowel between the consonants.'
  },
  7: {
    form: 'Katakana writes loanwords. Long vowels use ー: コーヒー, タクシー.',
    pitfall: 'Katakana is not a code for English spelling. パン is “pan” meaning bread, not a frying pan.'
  },
  8: {
    form: 'おはようございます (morning), こんにちは (day), こんばんは (evening), ありがとうございます (thanks).',
    pitfall: 'こんにちは ends in は, not わ. It is a fixed greeting, not the topic particle.'
  },
  9: {
    form: 'わたしは N です。N から きました。N が すきです。',
    pitfall: 'Never add さん to your own name. さん belongs to the other person.'
  },
  10: {
    form: 'いくらですか。／ なんぼですか。(Osaka) Numbers: いち に さん し ご ろく しち はち きゅう じゅう.',
    pitfall: '4 is よん or し, 7 is なな or しち. Use よん and なな when the number must be unambiguous.'
  },
  11: {
    form: 'A は B です。A は B じゃないです。Past: でした／じゃなかったです。',
    pitfall: 'The particle は is pronounced “wa”. Do not write わ in its place.'
  },
  12: {
    form: 'これ (near me), それ (near you), あれ (far from both), どれ (which).',
    pitfall: 'これ is not “this” before a noun. Use この: この ほん, not これ ほん.'
  },
  13: {
    form: 'Place に thing が あります. Place に person or animal が います.',
    pitfall: 'あります is for things, います for people and animals. A pet is います; a plant is あります.'
  },
  14: {
    form: 'い-adjective + noun: おいしい ラーメン. Polite: おいしいです. Past: おいしかったです. Negative: おいしくないです.',
    pitfall: 'Do not add な before a noun. おいしいな ラーメン is wrong; おいしい ラーメン is right.'
  },
  15: {
    form: 'な-adjective + な + noun: しずかな まち. Polite: しずかです. すき and きらい take が.',
    pitfall: 'すき is not a verb. コーヒーを すきです is wrong; use コーヒーが すきです.'
  },
  16: {
    form: 'V-ます (polite), V-ません (negative), V-ますか (question). Past: ました／ませんでした.',
    pitfall: 'The ます form is not the dictionary form. Learn both: たべます and たべる.'
  },
  17: {
    form: 'Noun を + transitive verb. コーヒーを のみます。',
    pitfall: 'を marks the object, not the subject. With すき, ほしい, できる and わかる, use が instead.'
  },
  18: {
    form: 'Place へ いきます (direction). Place で verb (where an action happens). Time に verb.',
    pitfall: 'The particle へ is pronounced “e”. で is “at/in” for an action; に is “at” for existence and clock time.'
  },
  19: {
    form: 'V-て + ください. Noun + を ください = please give me that thing.',
    pitfall: 'ください alone is not “please do”. For an action you need the て-form: まって ください.'
  },
  20: {
    form: 'V-ました (did), V-ませんでした (did not). い-adjective: おいしかったです. な-adjective/noun: でした.',
    pitfall: 'Do not say おいしいでした. い-adjectives change internally.'
  },
  21: {
    form: 'Number + じ (hour) + number + ふん/ぷん (minute). 〜から 〜まで = from … until ….',
    pitfall: 'ふん or ぷん depends on the number: いっぷん, にふん, さんぷん, よんぷん.'
  },
  22: {
    form: 'Number + がつ (month) + number + にち (day). Days: げつようび to にちようび.',
    pitfall: 'Dates 1–10 and 20 are irregular: ついたち, ふつか, みっか … はつか.'
  },
  23: {
    form: 'Own family: ちち, はは, あね, おとうと. Someone else’s: おとうさん, おかあさん, おねえさん.',
    pitfall: 'Do not use おとうさん for your own father in a formal introduction. Use ちち.'
  },
  24: {
    form: 'Noun を ください。おすすめは なんですか。おかいけい おねがいします。',
    pitfall: 'Quantities need a counter: コーヒーを ふたつ ください, not コーヒーを に ください.'
  },
  25: {
    form: 'いくらですか。〜を みせてください。カードで いいですか。',
    pitfall: 'で marks the means of payment: カードで. カードを はらいます is wrong.'
  },
  26: {
    form: 'まっすぐ いって、みぎに まがって ください。〜の となり／むかい／ちかく.',
    pitfall: 'みぎです alone means “it is the right one”. For “turn right”, say みぎに まがって ください.'
  },
  27: {
    form: '〜まで おねがいします (to … please). のりかえは どこですか。',
    pitfall: 'まで is “as far as”; に is the destination of a movement verb. Tickets usually use まで.'
  },
  28: {
    form: 'あめです／はれです／くもりです。あついです／さむいです。',
    pitfall: 'Weather nouns take です directly. あめが ふっています means it is raining now, not “it is rain”.'
  },
  29: {
    form: 'Noun が すきです／じょうずです／できます。しゅみは なんですか。',
    pitfall: 'じょうず describes other people. About yourself, use とくい or できます; わたしは じょうずです sounds boastful.'
  },
  30: {
    form: 'Time に V-ます。〜てから、〜 (after doing).',
    pitfall: 'Use に for clock time, not で. しちじで おきます is wrong.'
  },
  31: {
    form: 'V-て + V. The final verb carries the tense and the politeness.',
    pitfall: 'Only the last verb needs ます. たべて、のみます is fine; two ます forms sound like two separate sentences.'
  },
  32: {
    form: 'V-て + います = an action in progress, or a state that continues.',
    pitfall: 'しっています means “I know”, not “I am knowing”. Some ている forms are states, not actions.'
  },
  33: {
    form: 'V-ても いいですか (may I?). V-ては いけません (must not).',
    pitfall: 'いいですか is the question; いいです is the permission. Tone decides whether it sounds like “yes” or “go ahead”.'
  },
  34: {
    form: 'V-ない + で ください. ドアを あけないで ください。',
    pitfall: 'ないで ください attaches to a verb. For a noun, use 〜は いりません or 〜を くださいませんか.'
  },
  35: {
    form: 'Godan: かく → かける. Ichidan: たべる → たべられる. する → できる. くる → こられる.',
    pitfall: 'Potential verbs usually take が: かんじが かけます. The object marker を is increasingly heard but が is safer.'
  },
  36: {
    form: 'V-ます stem + たいです. Negative: たくないです.',
    pitfall: 'たい describes your own wish. For someone else, use 〜たがっている or ask 〜たいですか.'
  },
  37: {
    form: 'Clause + から (direct, casual). Clause + ので (softer, more polite).',
    pitfall: 'から can sound blunt in an apology. With a superior, ので is safer.'
  },
  38: {
    form: 'Clause + が、clause (polite). Clause + けど、clause (casual).',
    pitfall: 'The が in the middle is a conjunction, not the subject marker. Position tells you which one it is.'
  },
  39: {
    form: 'A より B のほうが 〜. A は B より 〜. いちばん 〜.',
    pitfall: 'より marks the standard of comparison, not the winner. とうきょうより おおさかの ほうが = Osaka is more … than Tokyo.'
  },
  40: {
    form: 'Number + counter: ひとつ ふたつ (things), ひとり ふたり (people), まい (flat), だい (machines).',
    pitfall: 'The counter is not optional. ひとつ for things, ひとり for people, いっぴき for animals.'
  },
  41: {
    form: 'V-た + ことが あります (have done). Negative: 〜た ことが ありません.',
    pitfall: 'This is experience, not recent past. きのう たべた ことが あります is wrong; say きのう たべました.'
  },
  42: {
    form: 'V-ます stem + ながら、V. The main action is the second clause.',
    pitfall: 'Both actions need the same subject. わたしが たべながら、かれが よむ is wrong.'
  },
  43: {
    form: 'V-て + しまいました = accidentally, or completely.',
    pitfall: 'It can sound like an excuse. For a neutral “finished”, use おわりました instead.'
  },
  44: {
    form: 'V-て + おきます = do in advance, or leave something in a state.',
    pitfall: 'おきます here is not “wake up”. The て-form and the context decide the meaning.'
  },
  45: {
    form: 'V-て + みます = try something and see what happens.',
    pitfall: 'みます here is not “look”. たべてみます means “try eating”, not “eat and watch”.'
  },
  46: {
    form: 'い-adjective stem + そう (おいしそう). な-adjective + そう (しずかそう). いい → よさそう.',
    pitfall: 'そう is appearance, not fact. おいしそうです = looks delicious; おいしいです = is delicious.'
  },
  47: {
    form: 'Plain clause + らしい (hearsay). Plain clause + みたい (impression, casual).',
    pitfall: 'らしい can also mean “typical of”: かれらしい = just like him. Context decides.'
  },
  48: {
    form: 'Plain clause + んです／のです. Question: どうして 〜んですか.',
    pitfall: 'んです adds explanation or emphasis. Overusing it can sound defensive.'
  },
  49: {
    form: 'V-る/V-た + とき、〜. い-adjective + とき. な-adjective + な とき.',
    pitfall: 'The tense is relative: たべる とき = before eating; たべた とき = after eating.'
  },
  50: {
    form: 'はじめに → そして → でも → だから → おわりに.',
    pitfall: 'Do not translate “and then” word for word. Japanese stories often drop the subject after the first sentence.'
  },
  51: {
    form: 'Godan: かく → かかれる. Ichidan: たべる → たべられる. する → される. くる → こられる.',
    pitfall: 'The passive can express annoyance: あめに ふられました = I got rained on. Do not always translate it as “was done”.'
  },
  52: {
    form: 'Godan: かく → かかせる. Ichidan: たべる → たべさせる. する → させる. くる → こさせる.',
    pitfall: 'Make versus let is context, not form. たべさせる can mean “make eat” or “let eat”.'
  },
  53: {
    form: 'Causative + passive: たべさせる → たべさせられる. かく → かかされる.',
    pitfall: 'The person who makes you act takes に: ちちに のまされました. Do not use を for that person.'
  },
  54: {
    form: 'Godan: かく → かけば. Ichidan: たべる → たべれば. する → すれば. くる → くれば. Negative: 〜なければ.',
    pitfall: 'ば is more hypothetical and formal than たら. For everyday “if”, たら is usually safer.'
  },
  55: {
    form: 'Plain past + ら: いったら, たべたら, あめだったら.',
    pitfall: 'たら can mean “when” as well as “if”. The result clause and the context decide.'
  },
  56: {
    form: 'Noun + なら. Plain clause + なら.',
    pitfall: 'なら picks up the other person’s topic: “if that is the case”. It is not a general “if”.'
  },
  57: {
    form: 'V-ても、〜. い-adjective: たかくても. な-adjective/noun: でも.',
    pitfall: 'ても is hypothetical; のに is factual contrast. “Even if” and “even though” are not interchangeable.'
  },
  58: {
    form: 'V-る + ように する (make a habit). V-る + ように なる (come to be able).',
    pitfall: 'ように する takes a volitional verb; ように なる often takes a potential or non-volitional verb. For a deliberate purpose, use ために.'
  },
  59: {
    form: 'Noun + の ために. V-る + ために. V-る + ように.',
    pitfall: 'ために with a verb implies the same subject. ように is used when the result is not fully controlled.'
  },
  60: {
    form: 'V-ていただけませんか (could you). V-にくいです (hard to). かもしれません (might).',
    pitfall: 'ていただけませんか is very polite. With friends, 〜てくれる？ is the natural register.'
  },
  61: {
    form: 'Plain clause + わけだ (that explains it). わけではない (it is not that).',
    pitfall: 'わけだ is a conclusion from evidence, not a casual “because”. Do not use it in place of から.'
  },
  62: {
    form: 'Plain clause + はずだ (should be). はずがない (cannot be).',
    pitfall: 'はずだ is expectation based on logic, not obligation. For “must do”, use なければならない.'
  },
  63: {
    form: 'かもしれない (might) < だろう (probably) < に違いない (must be).',
    pitfall: 'だろう is casual; in polite speech use でしょう. に違いない is strong and literary.'
  },
  64: {
    form: 'V-ます stem + ようがない. V-ます stem + っこない (casual).',
    pitfall: 'ようがない needs a missing method: なおしようがない. It is not a general “cannot”.'
  },
  65: {
    form: 'Noun + しか + negative. Noun + ばかり = only / nothing but.',
    pitfall: 'しか always needs a negative ending. しか あります is wrong; しか ありません.'
  },
  66: {
    form: '〜ほど = to the extent, so much that. 〜くらい = about, at least.',
    pitfall: 'ほど is often more formal and literal; くらい is lighter and more conversational.'
  },
  67: {
    form: 'Plain clause + のに、〜.',
    pitfall: 'のに expresses surprise or complaint. For neutral contrast, use が or けど.'
  },
  68: {
    form: 'Noun + の おかげで (thanks to). Noun + の せいで (because of, blame).',
    pitfall: 'おかげで is positive, せいで negative. Using おかげで for a bad result sounds sarcastic.'
  },
  69: {
    form: 'V-る + たびに (every time). V-る + ついでに (while you are at it).',
    pitfall: 'たびに is for repeated events, not one occasion. ついでに needs two actions by the same person.'
  },
  70: {
    form: 'Combine わけで, のに, おかげで and たびに in one short story.',
    pitfall: 'Do not stack more than two of these in one sentence. One clear contrast beats three half-connected clauses.'
  },
  71: {
    form: 'Noun + について (about). Noun + に対して (toward, or in contrast to).',
    pitfall: 'について is “about” a topic; に対して is a stance or reaction toward someone or something.'
  },
  72: {
    form: 'Noun + によって (by, or depending on). によって ちがう = varies by.',
    pitfall: 'によって marks an agent or a variable. Do not confuse it with によると (according to).'
  },
  73: {
    form: 'Noun + として (as, in the role of). としては (from the standpoint of).',
    pitfall: 'として is a role, not a similarity. せんせいとして = as a teacher; せんせいのように = like a teacher.'
  },
  74: {
    form: 'Noun + において (in, at; formal). Noun + における + noun.',
    pitfall: 'において is written and formal. In conversation, use で.'
  },
  75: {
    form: 'Noun + に もとづいて (based on). Noun + に もとづく + noun.',
    pitfall: 'もとづいて is an action; もとづく modifies a noun. Do not put もとづいて directly before a noun.'
  },
  76: {
    form: 'Noun + を めぐって (over, surrounding). Noun + を めぐる + noun.',
    pitfall: 'めぐって is for debate or conflict around a topic, not physical movement around a place.'
  },
  77: {
    form: 'Noun + に ともなって (along with). Noun + と ともに (together with).',
    pitfall: 'に伴って implies a causal link; とともに can simply mean “together with”.'
  },
  78: {
    form: 'V-ます stem + しだい、〜 (as soon as).',
    pitfall: 'しだい is formal and one-way: your action after something happens. It is not a general “when”.'
  },
  79: {
    form: 'Plain clause + ものの (although). Plain clause + とはいえ (that said).',
    pitfall: 'ものの is written and formal. とはいえ concedes a fact but keeps your conclusion.'
  },
  80: {
    form: '尊敬語 raises the other person: いらっしゃる, おっしゃる. 謙譲語 lowers you: うかがう, もうす. 丁寧語: です／ます／ございます.',
    pitfall: 'Do not use 謙譲語 about the other person. せんせいが うかがいます is wrong; use いらっしゃいます.'
  },
  81: {
    form: 'V-ない stem + ざるを えない. する → せざるを えない.',
    pitfall: 'ざるを得ない is formal and resigned. For everyday “have to”, use なければならない.'
  },
  82: {
    form: 'V-ます stem + かねない (might, usually bad). V-ます stem + かねる (cannot, polite).',
    pitfall: 'かねない is a risk; かねる is a refusal. The two point in opposite directions.'
  },
  83: {
    form: 'V-ます stem or noun + がち (tend to). Noun or い-adjective stem + っぽい (ish).',
    pitfall: 'がち usually describes an undesirable tendency. っぽい is casual and often slightly negative.'
  },
  84: {
    form: 'い-adjective stem or な-adjective + げ (looking). い-adjective stem + がる (showing signs of).',
    pitfall: 'がる describes a third person’s visible feeling: さむがっている. Do not use it for your own feelings.'
  },
  85: {
    form: 'V-ます stem + つつある (is in the process of).',
    pitfall: 'つつある is formal and gradual. For a simple ongoing action, use ている.'
  },
  86: {
    form: 'V-る + 一方だ (keeps …ing).',
    pitfall: '一方だ usually describes a negative trend. For a positive trend, 〜て きています is more natural.'
  },
  87: {
    form: 'Noun + に 反して (contrary to). Noun + に 反する + noun.',
    pitfall: 'に反して takes an expectation, rule or prediction, not a person.'
  },
  88: {
    form: 'Noun + だけでなく + も. Noun + に かぎらず.',
    pitfall: 'だけでなく needs a second element with も. Without it the sentence feels unfinished.'
  },
  89: {
    form: 'Noun + を 問わず (regardless of).',
    pitfall: 'を問わず is formal and fixed. For a simple “any”, どんな〜でも is more conversational.'
  },
  90: {
    form: 'Fact: 〜ました／です. Opinion: 〜と 思います. Reason: なぜなら〜からです. Conclusion: つまり〜.',
    pitfall: 'Do not present an opinion as a fact. 〜と 思います is the safest signal that a claim is yours.'
  },
  91: {
    form: 'Noun + を 皮切りに (starting with).',
    pitfall: 'The noun is the first item in a series, not the cause. More events must follow.'
  },
  92: {
    form: 'V-ない stem + ずには いられない. する → せずには いられない.',
    pitfall: 'This is emotional and often written. In conversation, 〜ちゃう or 〜て しまう is more natural.'
  },
  93: {
    form: 'Noun + なり + noun + なり (either … or …).',
    pitfall: 'なりなり offers examples, not a strict either-or. It often implies “or something like that”.'
  },
  94: {
    form: 'V-る + が はやいか、〜 (as soon as).',
    pitfall: 'が早いか is literary and links two actions that follow almost at once; the subject can change between them. It is not for a scheduled sequence.'
  },
  95: {
    form: 'V-る + や いなや、〜 (the moment).',
    pitfall: 'や否や is written and dramatic. It cannot follow a past-tense verb.'
  },
  96: {
    form: 'Noun + ともなると (when it comes to a level or role). Noun + ともあろう + noun.',
    pitfall: 'ともなると implies special expectations. It is not a neutral “when”.'
  },
  97: {
    form: 'Plain clause + ゆえに (therefore). Noun + の ゆえの + noun.',
    pitfall: 'ゆえに is formal and philosophical. In speech, だから is normal.'
  },
  98: {
    form: 'V-ない stem + んばかりに (as if about to).',
    pitfall: 'んばかりに describes an intense look or gesture, not an actual action. It is literary.'
  },
  99: {
    form: 'Noun + まじき + noun (unbecoming).',
    pitfall: 'まじき is fixed and formal: あるまじき 行為. Do not conjugate it like a normal adjective.'
  },
  100: {
    form: '要約 → 比較 → 譲歩 → 質問.',
    pitfall: 'Do not rush to your opinion. Summarise the other side first; たしかに〜が、〜 is the hinge.'
  }

};
