import test from 'node:test';
import assert from 'node:assert/strict';
import { restoreProgress, finishRound } from '../app/progress.ts';

test('previous progress upgrades without losing stars, rounds, or original badges', () => {
  const original = { stars: 25, rounds: 5, stickers: ['basilisk-english', 'croc-zhuyin'] };
  const migrated = restoreProgress(original);
  assert.deepEqual(migrated, { ...original, lessons: {} });
  const result = finishRound(migrated, 'basilisk', 'phonics', 5);
  assert.deepEqual(result, { stars: 30, rounds: 6, stickers: original.stickers, lessons: { phonics: 1 } });
  assert.deepEqual(restoreProgress(JSON.parse(JSON.stringify(result))), result);
  assert.deepEqual(migrated, { ...original, lessons: {} }, 'does not mutate saved progress');
});

test('new lessons award the existing subject badge and count each lesson separately', () => {
  let progress = restoreProgress({ stars: 5, rounds: 1, stickers: ['zombie-zhuyin'], lessons: { vowels: 1 } });
  progress = finishRound(progress, 'zombie', 'rhymes', 5);
  progress = finishRound(progress, 'zombie', 'blend', 5);
  assert.deepEqual(progress, { stars: 15, rounds: 3, stickers: ['zombie-zhuyin', 'zombie-english'], lessons: { vowels: 1, rhymes: 1, blend: 1 } });
});

test('invalid saved additions do not erase valid old progress or introduce badges', () => {
  const restored = restoreProgress({ stars: 10, rounds: 2, stickers: ['croc-english', 'croc-english', 'unknown'], lessons: { rhymes: -1, phonics: 3, vowels: '2', unknown: 99 } });
  assert.deepEqual(restored, { stars: 10, rounds: 2, stickers: ['croc-english'], lessons: { phonics: 3 } });
});

test('expanded lessons accumulate alongside all existing lesson counts', () => {
  const old = { stars: 20, rounds: 4, stickers: ['basilisk-english','basilisk-zhuyin'], lessons: { phonics: 1, blend: 1, vowels: 1, rhymes: 1 } };
  let progress = restoreProgress(old);
  for (const id of ['phonics2','blend2','vowels2','rhymes2','zhuyinBlend']) progress = finishRound(progress, 'basilisk', id, 5);
  assert.equal(progress.stars, 45);
  assert.equal(progress.rounds, 9);
  assert.deepEqual(progress.stickers, old.stickers);
  assert.deepEqual(progress.lessons, {...old.lessons,phonics2:1,blend2:1,vowels2:1,rhymes2:1,zhuyinBlend:1});
  assert.deepEqual(restoreProgress(JSON.parse(JSON.stringify(progress))), progress);
});
