import test from 'node:test';
import assert from 'node:assert/strict';
import { publicAssetUrl } from '../app/publicAssetUrl.ts';
import { BANKS } from '../app/questions.ts';
import { existsSync } from 'node:fs';

test('recordings resolve below the repository path and remain present in the game', () => {
  const recordings = [];
  const visit = audio => {
    if (!audio) return;
    if (audio.kind === 'sequence') audio.clips.forEach(visit);
    else if (audio.kind === 'recording') recordings.push(audio.src);
  };
  for (const item of Object.values(BANKS).flat()) {
    visit(item.pronunciation); visit(item.rhyme?.audio);
    item.segments?.forEach(segment => visit(segment.audio));
  }
  for (const src of recordings) {
    assert.equal(publicAssetUrl('/river-pals-learning/', src), `/river-pals-learning${src}`);
    assert.ok(existsSync(new URL(`../public${src}`, import.meta.url)), src);
  }
  assert.equal(publicAssetUrl('/', '/audio/phonics/s.mp3'), '/audio/phonics/s.mp3');
  assert.equal(publicAssetUrl('/demo', 'audio/phonics/s.mp3'), '/demo/audio/phonics/s.mp3');
});
