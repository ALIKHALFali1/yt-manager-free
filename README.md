import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { createStore } from '../src/store.js';
import { generateStoryIdea } from '../src/idea-generator.js';

test('generateStoryIdea creates a rich Arabic short-form idea', () => {
  const idea = generateStoryIdea({
    topic: 'قصص قصيرة عن التكنولوجيا',
    audience: 'شباب 18-35',
    angle: 'شرح عملي ومفيد'
  });

  assert.equal(idea.language, 'ar');
  assert.match(idea.title, /قصص قصيرة عن التكنولوجيا/i);
  assert.ok(idea.hook.includes('15 ثانية'));
  assert.ok(Array.isArray(idea.sources));
  assert.ok(idea.sources.length >= 3);
  assert.ok(Array.isArray(idea.verificationChecklist));
  assert.ok(idea.verificationChecklist.length >= 4);
});

test('store can persist library and ideas in a temporary data directory', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'yt-manager-free-'));
  const store = createStore(tempDir);

  store.saveLibrary([{ id: 1, url: 'https://example.com/a' }]);
  store.saveIdeas([{ id: 'idea-1', title: 'Idea 1', status: 'draft' }]);

  const library = store.readLibrary();
  const ideas = store.readIdeas();

  assert.equal(library.length, 1);
  assert.equal(ideas.length, 1);
  assert.equal(ideas[0].title, 'Idea 1');

  fs.rmSync(tempDir, { recursive: true, force: true });
});

