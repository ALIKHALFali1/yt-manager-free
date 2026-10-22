
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

  assert.ok(idea, 'يجب إنشاء فكرة');
  assert.equal(typeof idea.title, 'string');
  assert.ok(idea.title.length > 0, 'عنوان الفكرة غير فارغ');

  assert.equal(typeof idea.hook, 'string');
  assert.ok(idea.hook.length > 0, 'المقدمة الجاذبة غير فارغة');

  assert.ok(Array.isArray(idea.sources));
  assert.ok(Array.isArray(idea.verificationChecklist));
});

test('كل فكرة جديدة لها معرف وحالة مسودة', () => {
  const idea = generateStoryIdea({
    topic: 'العلوم',
    language: 'ar'
  });

  assert.ok(idea.id, 'يجب أن يكون للفكرة معرف');
  assert.equal(idea.status, 'draft');
});

test('إنشاء أفكار بموضوعات مختلفة', () => {
  const firstIdea = generateStoryIdea({
    topic: 'التاريخ',
    language: 'ar'
  });

  const secondIdea = generateStoryIdea({
    topic: 'التكنولوجيا',
    language: 'ar'
  });

  assert.ok(firstIdea.title);
  assert.ok(secondIdea.title);
  assert.notEqual(firstIdea.id, secondIdea.id);
});
