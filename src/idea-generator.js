
const SOURCE_LIBRARY = {
  general: [
    {
      label: 'بيان رسمي / تقرير حكومي',
      type: 'official',
      note: 'راجع الجهة الرسمية المعنية قبل التوثيق النهائي.'
    },
    {
      label: 'مقالة أو قاعدة بيانات موثوقة',
      type: 'reference',
      note: 'تأكد من تطابق المعلومة في أكثر من مصدر.'
    },
    {
      label: 'تقرير صحفي من جهة مستقلة',
      type: 'media',
      note: 'استخدمه لدعم المعلومات وليس باعتباره دليلًا وحيدًا.'
    }
  ],
  history: [
    {
      label: 'وثيقة تاريخية أو أرشيف رسمي',
      type: 'archive',
      note: 'تحقق من تواريخ الأحداث وسياقها التاريخي.'
    },
    {
      label: 'مؤسسة علمية أو مكتبة وطنية',
      type: 'academic',
      note: 'ابحث عن مصدر يشرح السياق التاريخي.'
    },
    {
      label: 'مقال تاريخي من جهة متخصصة',
      type: 'reference',
      note: 'قارن المعلومات مع مصدرين على الأقل.'
    }
  ],
  science: [
    {
      label: 'دراسة منشورة في مجلة علمية',
      type: 'academic',
      note: 'تحقق من الدراسة ونتائجها وتاريخ نشرها.'
    },
    {
      label: 'منشور رسمي من مؤسسة أكاديمية',
      type: 'official',
      note: 'راجع النتائج والسياق العلمي.'
    },
    {
      label: 'موقع متخصص في العلوم',
      type: 'reference',
      note: 'تجنب الادعاءات العلمية غير الموثقة.'
    }
  ],
  economy: [
    {
      label: 'بيانات مصرفية أو رسمية',
      type: 'official',
      note: 'راجع المؤشرات والتواريخ.'
    },
    {
      label: 'تقارير اقتصادية موثقة',
      type: 'reference',
      note: 'تأكد من تعريف المؤشرات الاقتصادية.'
    },
    {
      label: 'تحليل من مؤسسة مستقلة',
      type: 'media',
      note: 'استخدمه لفهم السياق مع مراجعة البيانات الأصلية.'
    }
  ],
  society: [
    {
      label: 'دراسة أو تقرير مجتمعي',
      type: 'academic',
      note: 'تحقق من حجم العينة وطبيعة البيانات.'
    },
    {
      label: 'بيانات رسمية أو محلية',
      type: 'official',
      note: 'تحقق من مصدر الأرقام ونطاقها الجغرافي.'
    },
    {
      label: 'تقرير من وسائل إعلام محلية',
      type: 'media',
      note: 'قارن المعلومات مع مصادر مستقلة.'
    }
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

  if (normalized.includes('تاريخ') || normalized.includes('history')) {
    return 'history';
  }

  if (normalized.includes('علم') || normalized.includes('science')) {
    return 'science';
  }

  if (
    normalized.includes('اقتصاد') ||
    normalized.includes('مال') ||
    normalized.includes('economy')
  ) {
    return 'economy';
  }

  if (
    normalized.includes('مجتمع') ||
    normalized.includes('سوق') ||
    normalized.includes('society')
  ) {
    return 'society';
  }

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

  return `في 15 ثانية فقط، ${cleanTopic} يفتح سؤالًا مهمًا يهم ${audienceText}: ماذا يحدث فعلًا، ولماذا يستحق اهتمامك؟`;
}

function buildScriptOutline(topic, angle) {
  const cleanTopic = String(topic || 'الموضوع').trim();
  const cleanAngle = String(angle || 'تفسير سريع وموثوق').trim();

  return [
    `الهوك: تقديم ${cleanTopic} بطريقة تثير الفضول.`,
    'المشهد 1: عرض المعلومة الأساسية في جملة واضحة.',
    'المشهد 2: شرح السبب أو السياق بلغة بسيطة.',
    `الزاوية الرئيسية: ${cleanAngle}.`,
    'الخاتمة: سؤال يدعو المشاهد للتفكير أو المتابعة.'
  ];
}

function buildChecklist(topic) {
  const cleanTopic = String(topic || 'الموضوع').trim();

  return [
    `تحقق من المعلومات المتعلقة بموضوع "${cleanTopic}" قبل النشر.`,
    'راجع مصدرين موثوقين على الأقل عند تناول معلومات واقعية.',
    'تأكد من وضوح النص وملاءمته للفيديو العمودي القصير.',
    'تحقق من حقوق استخدام الصور والموسيقى والمقاطع.'
  ];
}

export function generateStoryIdea({
  topic = 'قصص ومعلومات عربية',
  audience = 'شباب 18-35',
  angle = 'تفسير سريع ومفيد',
  language = 'ar'
} = {}) {
  const cleanTopic = String(topic || '').trim() || 'قصص ومعلومات عربية';
  const cleanAudience = String(audience || '').trim() || 'شباب 18-35';
  const cleanAngle = String(angle || '').trim() || 'تفسير سريع ومفيد';
  const cleanLanguage = String(language || '').trim() || 'ar';

  const templateKey = pickTemplate(cleanTopic);
  const sources = SOURCE_LIBRARY[templateKey] || SOURCE_LIBRARY.general;
  const now = new Date().toISOString();

  return {
    id: `idea-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    title: buildTitle(cleanTopic, cleanAudience),
    slug: slugify(`${cleanTopic}-${cleanAudience}`),
    topic: cleanTopic,
    audience: cleanAudience,
    angle: cleanAngle,
    language: cleanLanguage,
    hook: buildHook(cleanTopic, cleanAudience),
    scriptOutline: buildScriptOutline(cleanTopic, cleanAngle),
    sources: sources.map((source) => ({ ...source })),
    verificationChecklist: buildChecklist(cleanTopic),
    status: 'draft',
    createdAt: now,
    updatedAt: now
  };
}

export const ideaTemplates = SOURCE_LIBRARY;
