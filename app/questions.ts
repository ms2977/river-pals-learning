export type Mode = "english" | "zhuyin";
export type LessonId = "phonics" | "blend" | "phonics2" | "blend2" | "english" | "vowels" | "rhymes" | "vowels2" | "rhymes2" | "zhuyin" | "zhuyinBlend";
export type Difficulty = "guided" | "try" | "challenge";
export type Stage = 1 | 2 | 3;
export const PRACTICES: { id: Difficulty; title: string; description: string; options: number }[] = [
  { id: "guided", title: "一起學", description: "先看卡片，再三選一", options: 3 },
  { id: "try", title: "自己試", description: "先聽音作答，需要時再看卡片", options: 3 },
  { id: "challenge", title: "小挑戰", description: "先聽音作答，試試四選一", options: 4 },
];
export const getPractice = (id: Difficulty) => PRACTICES.find(p => p.id === id)!;
export const nextPractice = (id: Difficulty): Difficulty | null => id === "guided" ? "try" : id === "try" ? "challenge" : null;
export type Clip = { kind: "speech"; text: string; lang: string } | { kind: "recording"; src: string };
export type Pronunciation = Clip | { kind: "sequence"; clips: Clip[] };
export type RhymeWord = { label: string; emoji: string; onset: string };
export type Item = {
  id: string; label: string; emoji: string; translation: string; pronunciation: Pronunciation;
  example?: string; exampleAudio?: Clip; nameAudio?: Clip; segments?: { letter: string; audio: Clip }[];
  rhyme?: { symbol: string; audio: Clip; anchor: RhymeWord; matchOnset: string; tone: string };
};
export type Question = { item: Item; options: Item[] };
export const speech = (text: string, lang = "zh-TW"): Clip => ({ kind: "speech", text, lang });
export const phoneme = (letter: string): Clip => ({ kind: "recording", src: `/audio/phonics/${letter}.mp3` });
export const zhuyinSound = (number: number): Clip => ({ kind: "recording", src: `/audio/zhuyin/F${number}.wav` });

export const LESSONS: { id: LessonId; subject: Mode; title: string; subtitle: string; badge: string; tip: string; unit: string }[] = [
  { id: "phonics", subject: "english", title: "字母的聲音", subtitle: "s · a · t · p · i · n", badge: "從這裡開始", tip: "字母有名字，也有聲音。先聽它在單字裡的聲音！", unit: "字母音" },
  { id: "blend", subject: "english", title: "聲音拼起來", subtitle: "s ＋ a ＋ t → sat", badge: "試試拼讀", tip: "點小積木聽每個音，再把聲音連起來念。", unit: "拼讀短字" },
  { id: "phonics2", subject: "english", title: "更多字母音", subtitle: "m · d · g · o · b · f", badge: "六位新朋友", tip: "多認識六個聲音！o 先練 ox 開頭的短母音，g 先練 goat 開頭的聲音。", unit: "字母音" },
  { id: "blend2", subject: "english", title: "新聲音拼短字", subtitle: "map · dog · bag · fan 等 8 個字", badge: "新舊一起用", tip: "把學過的字母音放在一起，看看能拼出哪些新單字。", unit: "拼讀短字" },
  { id: "english", subject: "english", title: "生活單字", subtitle: "apple · cat · sun 等 12 個單字", badge: "原有練習", tip: "聽聽單字，認識生活裡的新朋友。", unit: "英文單字" },
  { id: "vowels", subject: "zhuyin", title: "先聽韻母", subtitle: "ㄚ · ㄧ · ㄨ · ㄠ · ㄡ · ㄢ", badge: "從這裡開始", tip: "先聽韻母的聲音，嘴巴跟著念一次。", unit: "韻母" },
  { id: "rhymes", subject: "zhuyin", title: "找韻腳朋友", subtitle: "貓和包，尾音都是 ㄠ", badge: "聽聽哪裡像", tip: "開頭可以不一樣，找找尾音相同的好朋友。", unit: "韻腳配對" },
  { id: "vowels2", subject: "zhuyin", title: "更多韻母朋友", subtitle: "ㄜ · ㄞ · ㄟ · ㄣ · ㄤ · ㄥ", badge: "六個新韻母", tip: "聽聽新的韻母。鼻子、嘴巴的感覺，和前面的聲音有哪裡不一樣？", unit: "韻母" },
  { id: "rhymes2", subject: "zhuyin", title: "新的韻腳配對", subtitle: "杯和飛、門和盆、燈和風", badge: "換一組聽聽", tip: "每張卡片都能聽。找找開頭不同、尾音相同的朋友。", unit: "韻腳配對" },
  { id: "zhuyin", subject: "zhuyin", title: "再認識聲符", subtitle: "ㄅ · ㄆ · ㄇ 等 12 個聲符", badge: "接著探索", tip: "聽聽聲符，再找出它的樣子。", unit: "注音聲符" },
  { id: "zhuyinBlend", subject: "zhuyin", title: "注音拼拼看", subtitle: "ㄇ ＋ ㄚ → ㄇㄚ（媽）", badge: "先拼第一聲", tip: "先聽聲符，再聽韻母，最後聽拼起來的音。這一站都先練第一聲。", unit: "注音拼讀" },
];
export function getLesson(id: LessonId) { return LESSONS.find(lesson => lesson.id === id)!; }
export const STAGES: { id: Stage; title: string; description: string; lessons: LessonId[] }[] = [
  { id: 1, title: "認識聲音", description: "先熟悉第一組聲音，慢慢聽、慢慢念。", lessons: ["phonics", "blend", "vowels", "rhymes"] },
  { id: 2, title: "更多朋友", description: "第一步玩熟了，再多認識一組聲音。", lessons: ["phonics2", "blend2", "vowels2", "rhymes2"] },
  { id: 3, title: "一起運用", description: "英文認識生活單字；注音先練聲符，再試著拼起來。", lessons: ["english", "zhuyin", "zhuyinBlend"] },
];
export const isPhonics = (id: LessonId) => id === "phonics" || id === "phonics2";
export const isVowels = (id: LessonId) => id === "vowels" || id === "vowels2";

const english: Item[] = [
  ["apple", "🍎", "蘋果"], ["ball", "⚽", "球"], ["cat", "🐱", "貓咪"], ["dog", "🐶", "小狗"],
  ["fish", "🐟", "魚"], ["sun", "☀️", "太陽"], ["book", "📖", "書"], ["car", "🚗", "汽車"],
  ["bird", "🐦", "小鳥"], ["milk", "🥛", "牛奶"], ["moon", "🌙", "月亮"], ["tree", "🌳", "樹"],
].map(([label, emoji, translation]) => ({ id: label, label, emoji, translation, pronunciation: speech(label, "en-US") }));
const zhuyin: Item[] = [
  ["ㄅ", "🥛", "玻璃"], ["ㄆ", "🍇", "葡萄"], ["ㄇ", "🐱", "貓咪"], ["ㄈ", "🪁", "風箏"],
  ["ㄉ", "🐘", "大象"], ["ㄊ", "🐰", "兔子"], ["ㄋ", "🥛", "牛奶"], ["ㄌ", "🐯", "老虎"],
  ["ㄍ", "🐶", "狗狗"], ["ㄎ", "👖", "口袋"], ["ㄏ", "🌸", "花朵"], ["ㄐ", "🥚", "雞蛋"],
].map(([label, emoji, example], index) => ({ id: label, label, emoji, translation: `${example}的開頭`, example, pronunciation: zhuyinSound(index + 1) }));
const phonics: Item[] = [
  ["s", "sun", "☀️", "太陽"], ["a", "ant", "🐜", "螞蟻"], ["t", "tap", "🚰", "水龍頭"],
  ["p", "pan", "🍳", "平底鍋"], ["i", "ink", "🖋️", "墨水"], ["n", "net", "🥅", "網子"],
].map(([label, example, emoji, translation]) => ({ id: label, label, emoji, translation, example, pronunciation: phoneme(label), exampleAudio: speech(example, "en-GB"), nameAudio: speech(label.toUpperCase(), "en-GB") }));
const phonics2: Item[] = [
  ["m", "moon", "🌙", "月亮"], ["d", "dog", "🐶", "狗"], ["g", "goat", "🐐", "山羊"],
  ["o", "ox", "🐂", "牛"], ["b", "ball", "⚽", "球"], ["f", "fish", "🐟", "魚"],
].map(([label, example, emoji, translation]) => ({ id: label, label, emoji, translation, example, pronunciation: phoneme(label), exampleAudio: speech(example, "en-GB"), nameAudio: speech(label.toUpperCase(), "en-GB") }));
const blend: Item[] = [
  ["sat", "🪑", "坐下了"], ["sit", "🧘", "坐下"], ["pin", "🧷", "別針"],
  ["pan", "🍳", "平底鍋"], ["tap", "🚰", "水龍頭"], ["nap", "😴", "小睡"],
].map(([label, emoji, translation]) => ({ id: label, label, emoji, translation,
  pronunciation: { kind: "sequence", clips: [...[...label].map(phoneme), speech(label, "en-GB")] },
  segments: [...label].map(letter => ({ letter, audio: phoneme(letter) })), exampleAudio: speech(label, "en-GB"),
}));
const rhymeGroups = [
  { symbol: "ㄚ", file: 22, anchor: { label: "沙", emoji: "🏖️", onset: "ㄕ" }, match: { label: "他", emoji: "🧒", onset: "ㄊ" }, tone: "" },
  { symbol: "ㄧ", file: 35, anchor: { label: "雞", emoji: "🐔", onset: "ㄐ" }, match: { label: "七", emoji: "7️⃣", onset: "ㄑ" }, tone: "" },
  { symbol: "ㄨ", file: 36, anchor: { label: "豬", emoji: "🐷", onset: "ㄓ" }, match: { label: "書", emoji: "📖", onset: "ㄕ" }, tone: "" },
  { symbol: "ㄠ", file: 28, anchor: { label: "貓", emoji: "🐱", onset: "ㄇ" }, match: { label: "包", emoji: "👜", onset: "ㄅ" }, tone: "" },
  { symbol: "ㄡ", file: 29, anchor: { label: "狗", emoji: "🐶", onset: "ㄍ" }, match: { label: "手", emoji: "✋", onset: "ㄕ" }, tone: "ˇ" },
  { symbol: "ㄢ", file: 30, anchor: { label: "山", emoji: "⛰️", onset: "ㄕ" }, match: { label: "三", emoji: "3️⃣", onset: "ㄙ" }, tone: "" },
];
const moreRhymeGroups = [
  { symbol: "ㄜ", file: 24, anchor: { label: "車", emoji: "🚗", onset: "ㄔ" }, match: { label: "喝", emoji: "🥤", onset: "ㄏ" }, tone: "" },
  { symbol: "ㄞ", file: 26, anchor: { label: "白", emoji: "⚪", onset: "ㄅ" }, match: { label: "來", emoji: "👋", onset: "ㄌ" }, tone: "ˊ" },
  { symbol: "ㄟ", file: 27, anchor: { label: "杯", emoji: "🥛", onset: "ㄅ" }, match: { label: "飛", emoji: "🕊️", onset: "ㄈ" }, tone: "" },
  { symbol: "ㄣ", file: 31, anchor: { label: "門", emoji: "🚪", onset: "ㄇ" }, match: { label: "盆", emoji: "🪴", onset: "ㄆ" }, tone: "ˊ" },
  { symbol: "ㄤ", file: 32, anchor: { label: "湯", emoji: "🍲", onset: "ㄊ" }, match: { label: "方", emoji: "🟦", onset: "ㄈ" }, tone: "" },
  { symbol: "ㄥ", file: 33, anchor: { label: "燈", emoji: "💡", onset: "ㄉ" }, match: { label: "風", emoji: "🌬️", onset: "ㄈ" }, tone: "" },
];
const blend2: Item[] = [
  ["map", "🗺️", "地圖"], ["mat", "🟫", "墊子"], ["man", "👨", "男人"], ["dog", "🐶", "狗"],
  ["dig", "⛏️", "挖"], ["dot", "🔴", "圓點"], ["bag", "👜", "袋子"], ["fan", "🪭", "扇子"],
].map(([label, emoji, translation]) => ({ id: label, label, emoji, translation,
  pronunciation: { kind: "sequence", clips: [...[...label].map(phoneme), speech(label, "en-GB")] },
  segments: [...label].map(letter => ({ letter, audio: phoneme(letter) })), exampleAudio: speech(label, "en-GB"),
}));
const zhuyinBlend: Item[] = [
  { label: "ㄇㄚ", word: "媽", emoji: "👩", files: [3, 22] }, { label: "ㄅㄚ", word: "八", emoji: "8️⃣", files: [1, 22] },
  { label: "ㄊㄚ", word: "他", emoji: "🧒", files: [6, 22] }, { label: "ㄅㄠ", word: "包", emoji: "👜", files: [1, 28] },
  { label: "ㄉㄠ", word: "刀", emoji: "🍴", files: [5, 28] }, { label: "ㄇㄠ", word: "貓", emoji: "🐱", files: [3, 28] },
].map(({label, word, emoji, files}) => ({ id: label, label, emoji, translation: word, example: word,
  pronunciation: { kind: "sequence", clips: [...files.map(zhuyinSound), speech(word)] },
  segments: [...label].map((letter, index) => ({ letter, audio: zhuyinSound(files[index]) })), exampleAudio: speech(word),
}));
const vowels: Item[] = rhymeGroups.map(group => ({ id: group.symbol, label: group.symbol, emoji: group.anchor.emoji,
  translation: `「${group.anchor.label}」和「${group.match.label}」都有這個韻母`, pronunciation: zhuyinSound(group.file) }));
const rhymes: Item[] = rhymeGroups.map(group => ({ id: `rhyme-${group.symbol}`, label: group.match.label, emoji: group.match.emoji,
  translation: `和「${group.anchor.label}」有相同尾音`, pronunciation: speech(group.match.label),
  rhyme: { symbol: group.symbol, audio: zhuyinSound(group.file), anchor: group.anchor, matchOnset: group.match.onset, tone: group.tone } }));
const vowels2: Item[] = moreRhymeGroups.map(group => ({ id: group.symbol, label: group.symbol, emoji: group.anchor.emoji,
  translation: `「${group.anchor.label}」和「${group.match.label}」都有這個韻母`, pronunciation: zhuyinSound(group.file) }));
const rhymes2: Item[] = moreRhymeGroups.map(group => ({ id: `rhyme-${group.symbol}`, label: group.match.label, emoji: group.match.emoji,
  translation: `和「${group.anchor.label}」有相同尾音`, pronunciation: speech(group.match.label),
  rhyme: { symbol: group.symbol, audio: zhuyinSound(group.file), anchor: group.anchor, matchOnset: group.match.onset, tone: group.tone } }));
export const BANKS: Record<LessonId, Item[]> = { phonics, blend, phonics2, blend2, english, vowels, rhymes, vowels2, rhymes2, zhuyin, zhuyinBlend };
export const learningAudio = (item: Item): Pronunciation => item.rhyme?.audio ?? item.pronunciation;
export const questionAudio = (item: Item, difficulty: Difficulty = "guided"): Pronunciation => item.rhyme ? speech(item.rhyme.anchor.label) : item.segments && difficulty !== "guided" ? item.exampleAudio! : item.pronunciation;
export function quizTitle(lesson: LessonId, item: Item, difficulty: Difficulty = "guided") {
  if (item.rhyme) return `誰和「${item.rhyme.anchor.label}」有一樣的尾音？`;
  if (isPhonics(lesson)) return "這個聲音是哪個字母？";
  if (lesson === "zhuyinBlend") return "拼起來的音，是哪一組注音？";
  if (item.segments) return difficulty === "guided" ? "聲音合起來，是哪個字？" : "聽完整單字，選一選！";
  if (lesson === "english") return `${item.translation}的英文是哪一個？`;
  return isVowels(lesson) ? "你聽到哪個韻母？" : "你聽到哪一個聲符？";
}
export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
export function makeRound(lesson: LessonId, random = Math.random, difficulty: Difficulty = "guided"): Question[] {
  const bank = BANKS[lesson];
  return shuffle(bank, random).slice(0, 5).map(item => {
    const others = shuffle(bank.filter(other => other.id !== item.id), random);
    // Only the challenge adds a nearby spelling; the correct answer stays unique.
    if (difficulty === "challenge" && item.segments) others.sort((a, b) => {
      const distance = (other: Item) => [...item.label].filter((letter, i) => letter !== other.label[i]).length;
      return distance(a) - distance(b);
    });
    return { item, options: shuffle([item, ...others.slice(0, getPractice(difficulty).options - 1)], random) };
  });
}
