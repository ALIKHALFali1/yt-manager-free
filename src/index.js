const SOURCE_LIBRARY = {
  general: [
    { label: 'بيان رسمي / تقرير حكومي', type: 'official', note: 'راجع الجهة الرسمية المعنية قبل التوثيق النهائي.' },
    { label: 'مقالة أو قاعدة بيانات موثوقة', type: 'reference', note: 'تأكد من تطابق الرقم في أكثر من مصدر.' },
    { label: 'تقرير صحفي من جهة مستقلة', type: 'media', note: 'استخدمه فقط كدعم وليس كحجة مستقلة.' }
  ],
  history: [
    { label: 'وثيقة تاريخية أو أرشيف رسمي', type: 'archive', note: 'تحقق من تواريخ الأحداث وسياقها التاريخي.' },
    { label: 'مؤسسة علمية أو مكتبة وطنية', type: 'academic', note: 'رابط موثوق يشرح السياق والمنطلق.' },
    { label: 'مقال تاريخي من جهة متخصصة', type: 'reference', note: 'قارن مع مصدرين على الأقل.' }
  ],
  science: [
    { label: 'دراسة منشورة في مجلة علمية', type: 'academic', note: 'تأكد من أن الدراسة حديثة ومكتملة.' },
    { label: 'منشور رسمي من مؤسسة أكاديمية', type: 'official', note: 'التحقق من السير العلمي والنتائج.' },
    { label: 'موقع مختص في العلوم', type: 'reference', note: 'لا تعتمد على الادعاءات غير الموثقة.' }
  ],
  economy: [
    { label: 'بيانات مصرفية أو رسمية', type: 'official', note: 'راجِع المؤشرات والتواريخ.' },
    { label: 'تقارير اقتصادية موثقة', type: 'reference', note: 'تأكد من اختلاف المصطلحات بين المؤشرات.' },
    { label: 'منشور تحليلي من مؤسسة مستقلة', type: 'media', note: 'استعمله لفهم السياق وليس كأصل وحيد.' }
  ],
  society: [
    { label: 'دراسة أو تقرير مجتمعي', type: 'academic', note: 'تحقق من حجم العينة وطبيعة البيانات.' },
    { label: 'بيانات رسمية أو محلية', type: 'official', note: 'تأكد من أرقام المقاطعات أو المناطق.' },
    { label: 'مقال متابعة في وسائل إعلام محلية', type: 'media', note: 'تحقق من سبب التباين بين المصادر.' }
  ]
};

function slugify(value) {
  return String(value || 'idea')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'idea';
}

function pickTemplate(topic) {
  const normalized = String(topic || '').trim().toLowerCase();

  if (normalized.includes('تاريخ') || normalized.includes('history')) return 'history';
  if (normalized.includes('علم') || normalized.includes('science')) return 'science';
  if (normalized.includes('اقتصاد') || normalized.includes('مال') || normalized.includes('economy')) return 'economy';
  if (normalized.includes('مجتمع') || normalized.includes('سوق') || normalized.includes('society')) return 'society';
  return 'general';
}

function buildTitle(topic, audience) {
  const cleanTopic = String(topic || 'قصة قصيرة').trim();
  const audienceText = String(audience || 'شباب 18-35').trim();
  return `${cleanTopic} | ${audienceText}`;
}

function buildHook(topic, audience) {
  const cleanTopic = String(topic || 'موضوع').trim();
  const audienceText = String(audience || 'شباب 18-35').trim();
  return `في 15 ثانية فقط، ${cleanTopic} يفتح سؤالًا حاسمًا يهم ${audienceText}: ماذا يحدث فعليًا، ولماذا يهمك هذا الآن؟`;
}

function buildScriptOutline(topic, angle) {
  const cleanTopic = String(topic || 'الموضوع').trim();
  const cleanAngle = String(angle || 'تفسير سريع وموثوق').trim();

  return [
    `الهوك: ${cleanTopic} في 10 ثوانٍ، مع سؤال مباشر يثير الفضول.`,
    'المشهد 1: عرض المعلومة الأساسية بمقدمة قصيرة وعاطفية.',
    'المشهد 2: تفسير السبب أو السياق بطريقة بسيطة ومباشرة.',
    `الرأي/الزاوية: ${cleanAngle}.`,
    'الخاتمة: دعوة قصيرة إلى التفكير أو المتابعة مع مصدر موثوق.'
  ];
}

function buildChecklist(topic) {
  return [
    `تحقق من اسم ${String(topic || 'الموضوع').trim()} ومصطلحاته الدقيقة قبل النشر.`,
    'راجع أكثر من مصدر موثوق وقارن الأرقام أو التفاصيل.',
    'تأكد أن النص عربي وواضح ومناسب لقصص الفيديو العمودي.',
    'افحص حقوق الاستخدام والملكية إذا استُخدمت صور أو موسيقى أو لقطات.'
  ];
}

export function generateStoryIdea({ topic = 'قصص ومعلومات عربية', audience = 'شباب 18-35', angle = 'تفسير سريع ومفيد', language = 'ar' } = {}) {
  const templateKey = pickTemplate(topic);
  const sources = SOURCE_LIBRARY[templateKey] || SOURCE_LIBRARY.general;

  return {
    id: `idea-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    title: buildTitle(topic, audience),
    slug: slugify(`${topic}-${audience}`),
    topic: String(topic).trim() || 'قصص ومعلومات عربية',
    audience: String(audience).trim() || 'شباب 18-35',
    angle: String(angle).trim() || 'تفسير سريع ومفيد',
    language: String(language).trim() || 'ar',
    hook: buildHook(topic, audience),
    scriptOutline: buildScriptOutline(topic, angle),
    sources: sources.map((source) => ({
      label: source.label,
      type: source.type,
      note: source.note
    })),
    verificationChecklist: buildChecklist(topic),
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export const ideaTemplates = SOURCE_LIBRARY;
