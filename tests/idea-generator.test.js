
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateStoryIdea } from '../src/idea-generator.js';

test('إنشاء فكرة قصة يحتوي على البيانات الأساسية', () => {
  const idea = generateStoryIdea({
    topic: 'الذكاء الاصطناعي',
    audience: 'شباب 18-35',
    angle: 'شرح عملي ومفيد',
    language: 'ar'
  });

  assert.ok(idea);
  assert.equal(typeof idea.title, 'string');
  assert.ok(idea.title.length > 0);

  assert.equal(typeof idea.hook, 'string');
  assert.ok(idea.hook.length > 0);

  assert.ok(Array.isArray(idea.sources));
  assert.ok(Array.isArray(idea.verificationChecklist));
});

test('كل فكرة جديدة لها معرف وحالة', () => {
  const idea = generateStoryIdea({
    topic: 'العلوم',
    language: 'ar'
  });

  assert.ok(idea.id);
  assert.equal(idea.status, 'draft');
});
