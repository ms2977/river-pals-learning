import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BANKS, LESSONS, STAGES, PRACTICES, nextPractice, learningAudio, questionAudio, makeRound, shuffle } from '../app/questions.ts';

test('each round has five distinct lessons and exactly one correct option per lesson', () => {
  for (const mode of LESSONS.map(l => l.id)) {
    for (let i = 0; i < 100; i++) {
      const round = makeRound(mode);
      assert.equal(round.length, 5);
      assert.equal(new Set(round.map(q => q.item.id)).size, 5);
      for (const q of round) {
        assert.equal(q.options.length, 3);
        assert.equal(new Set(q.options.map(o => o.id)).size, 3);
        assert.equal(q.options.filter(o => o.id === q.item.id).length, 1);
        assert.ok(q.options.every(o => BANKS[mode].includes(o)));
      }
    }
  }
});
test('question generation leaves the bank unchanged and supports boundary random values', () => {
  const snapshot = JSON.stringify(BANKS);
  for (const mode of LESSONS.map(l => l.id)) {
    for (const random of [() => 0, () => 0.999999]) {
      assert.equal(makeRound(mode, random).length, 5);
    }
  }
  assert.equal(JSON.stringify(BANKS), snapshot);
  assert.deepEqual(shuffle([]), []);
});
test('English retains word speech and every Bopomofo symbol has its own playable recording', () => {
  assert.equal(BANKS.english.length, 12);
  assert.equal(BANKS.zhuyin.length, 12);
  for (const q of BANKS.english) {
    assert.deepEqual(q.pronunciation, { kind: 'speech', text: q.label, lang: 'en-US' });
  }
  const symbolFiles = { 'ㄅ':1, 'ㄆ':2, 'ㄇ':3, 'ㄈ':4, 'ㄉ':5, 'ㄊ':6, 'ㄋ':7, 'ㄌ':8, 'ㄍ':9, 'ㄎ':10, 'ㄏ':11, 'ㄐ':12, 'ㄚ':22, 'ㄧ':35, 'ㄨ':36, 'ㄠ':28, 'ㄡ':29, 'ㄢ':30, 'ㄜ':24, 'ㄞ':26, 'ㄟ':27, 'ㄣ':31, 'ㄤ':32, 'ㄥ':33 };
  for (const q of [...BANKS.zhuyin, ...BANKS.vowels, ...BANKS.vowels2]) {
    assert.deepEqual(q.pronunciation, { kind: 'recording', src: `/audio/zhuyin/F${symbolFiles[q.label]}.wav` });
    const wav = readFileSync(new URL(`../public${q.pronunciation.src}`, import.meta.url));
    assert.equal(wav.toString('ascii', 0, 4), 'RIFF');
    assert.equal(wav.toString('ascii', 8, 12), 'WAVE');
    let bytesPerSecond = 0, dataBytes = 0;
    for (let offset = 12; offset + 8 <= wav.length;) {
      const type = wav.toString('ascii', offset, offset + 4);
      const size = wav.readUInt32LE(offset + 4);
      assert.ok(offset + 8 + size <= wav.length, 'WAV chunk must not be truncated');
      if (type === 'fmt ') bytesPerSecond = wav.readUInt32LE(offset + 16);
      if (type === 'data') dataBytes = size;
      offset += 8 + size + size % 2;
    }
    assert.ok(bytesPerSecond > 0);
    assert.ok(dataBytes / bytesPerSecond > 0.2 && dataBytes / bytesPerSecond < 6, 'one short symbol recording');
  }
});

test('phonics uses recorded sounds distinct from alphabet names and word examples', () => {
  assert.deepEqual(BANKS.phonics.map(q => q.label), [...'satpin']);
  assert.deepEqual(BANKS.phonics2.map(q => q.label), [...'mdgobf']);
  for (const item of [...BANKS.phonics, ...BANKS.phonics2]) {
    assert.equal(item.pronunciation.kind, 'recording');
    assert.equal(item.pronunciation.src, `/audio/phonics/${item.label}.mp3`);
    const bytes = readFileSync(new URL(`../public${item.pronunciation.src}`, import.meta.url));
    assert.ok(bytes.length > 1000, 'sound asset is not empty');
    assert.ok(bytes.toString('ascii', 0, 3) === 'ID3' || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0), 'MP3 header');
    assert.deepEqual(item.nameAudio, { kind: 'speech', text: item.label.toUpperCase(), lang: 'en-GB' });
    assert.deepEqual(item.exampleAudio, { kind: 'speech', text: item.example, lang: 'en-GB' });
  }
});

test('blending only uses taught phonemes in word order before the complete word', () => {
  assert.deepEqual(BANKS.blend.map(item => item.label), ['sat', 'sit', 'pin', 'pan', 'tap', 'nap']);
  for (const [bank, sounds] of [[BANKS.blend, BANKS.phonics], [BANKS.blend2, [...BANKS.phonics, ...BANKS.phonics2]]]) for (const item of bank) {
    const taught = new Map(sounds.map(item => [item.label, item.pronunciation]));
    assert.equal(item.pronunciation.kind, 'sequence');
    const expected = [...item.label].map(letter => {
      assert.ok(taught.has(letter), `${letter} must already be taught`);
      return taught.get(letter);
    });
    assert.deepEqual(item.segments.map(s => s.audio), expected);
    assert.deepEqual(item.pronunciation.clips, [...expected, { kind: 'speech', text: item.label, lang: 'en-GB' }]);
  }
});

test('rhyme prompts read words while symbol practice keeps its own recording', () => {
  const pairs = [['ㄚ','沙','他'], ['ㄧ','雞','七'], ['ㄨ','豬','書'], ['ㄠ','貓','包'], ['ㄡ','狗','手'], ['ㄢ','山','三']];
  assert.deepEqual(BANKS.rhymes.map(q => [q.rhyme.symbol, q.rhyme.anchor.label, q.label]), pairs);
  for (const item of [...BANKS.rhymes, ...BANKS.rhymes2]) {
    assert.notEqual(item.rhyme.anchor.onset, item.rhyme.matchOnset);
    assert.deepEqual(questionAudio(item), { kind: 'speech', text: item.rhyme.anchor.label, lang: 'zh-TW' });
    assert.deepEqual(learningAudio(item), [...BANKS.vowels, ...BANKS.vowels2].find(v => v.label === item.rhyme.symbol).pronunciation);
  }
  for (let i = 0; i < 50; i++) for (const q of makeRound('rhymes')) {
    assert.equal(q.options.filter(o => o.rhyme.symbol === q.item.rhyme.symbol).length, 1, 'only one matching ending');
  }
});

test('all difficulty levels keep five questions and one unambiguous answer', () => {
  for (const lesson of LESSONS) for (const practice of PRACTICES) for (let i = 0; i < 20; i++) {
    const round = makeRound(lesson.id, Math.random, practice.id);
    assert.equal(round.length, 5);
    assert.equal(new Set(round.map(q => q.item.id)).size, 5);
    for (const q of round) {
      assert.equal(q.options.length, practice.options);
      assert.equal(new Set(q.options.map(o => o.label)).size, practice.options);
      assert.equal(q.options.filter(o => o.id === q.item.id).length, 1);
      if (q.item.rhyme) assert.equal(q.options.filter(o => o.rhyme.symbol === q.item.rhyme.symbol).length, 1);
    }
  }
});

test('practice advances one small step and independent blending asks the complete word', () => {
  assert.equal(nextPractice('guided'), 'try');
  assert.equal(nextPractice('try'), 'challenge');
  assert.equal(nextPractice('challenge'), null);
  for (const item of [...BANKS.blend, ...BANKS.blend2, ...BANKS.zhuyinBlend]) {
    assert.deepEqual(questionAudio(item, 'guided'), item.pronunciation);
    assert.deepEqual(questionAudio(item, 'try'), item.exampleAudio);
    assert.deepEqual(questionAudio(item, 'challenge'), item.exampleAudio);
  }
});

test('challenge blending includes the closest available spelling without changing the bank', () => {
  const snapshot = JSON.stringify(BANKS);
  for (const lesson of ['blend', 'blend2', 'zhuyinBlend']) for (const q of makeRound(lesson, () => 0.4, 'challenge')) {
    const distance = other => [...q.item.label].filter((letter,i) => letter !== other.label[i]).length;
    const nearest = Math.min(...BANKS[lesson].filter(o => o.id !== q.item.id).map(distance));
    assert.ok(q.options.some(o => o.id !== q.item.id && distance(o) === nearest));
  }
  assert.equal(JSON.stringify(BANKS), snapshot);
});

test('stages cover all lessons once and first-tone Bopomofo blends use previously taught symbols', () => {
  const ids = STAGES.flatMap(stage => stage.lessons);
  assert.deepEqual([...ids].sort(), LESSONS.map(l => l.id).sort());
  assert.equal(new Set(ids).size, ids.length);
  const symbols = new Map([...BANKS.zhuyin, ...BANKS.vowels].map(item => [item.label, item.pronunciation]));
  const words = { 'ㄇㄚ':'媽', 'ㄅㄚ':'八', 'ㄊㄚ':'他', 'ㄅㄠ':'包', 'ㄉㄠ':'刀', 'ㄇㄠ':'貓' };
  for (const item of BANKS.zhuyinBlend) {
    assert.equal(item.example, words[item.label]);
    assert.equal(item.segments.length, 2);
    const recordings = [...item.label].map(letter => symbols.get(letter));
    assert.ok(recordings.every(clip => clip?.kind === 'recording'));
    assert.deepEqual(item.segments.map(s => s.audio), recordings);
    assert.deepEqual(item.pronunciation.clips, [...recordings, {kind:'speech',text:words[item.label],lang:'zh-TW'}]);
  }
});
