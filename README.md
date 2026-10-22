# yt-manager-free

نظام مجاني لإدارة محتوى YouTube Shorts وشرح القصص والمعلومات بشكل منظم وآمن.

## نظرة عامة

هذا المشروع يركز على:

- توليد أفكار قصيرة عربية للقصص والمعلومات
- إعداد سيناريوهات فيديو عمودية 1080×1920
- إدارة السكريبتات والملفات محليًا داخل `.data`
- إنتاج فيديو محلي باستخدام FFmpeg دون نشر تلقائي إلى YouTube
- التشغيل داخل GitHub Actions بشكل مجدول وغير مستمر

## المتطلبات

- Node.js 18+
- FFmpeg (اختياري للإنتاج، لكنه ضروري عند تشغيل الفيديوهات)

## التثبيت

```bash
npm install
```

## الأوامر الأساسية

```bash
node src/index.js add "https://www.youtube.com/watch?v=example"
node src/index.js list
node src/index.js remove 1
node src/index.js clear
node src/index.js help
```

## توليد الأفكار والسكريبتات

```bash
node src/index.js idea generate --topic "قصص قصيرة عن التقنية" --audience "شباب 18-35" --angle "شرح عملي ومفيد"
node src/index.js idea list
node src/index.js script generate --topic "التقنية في الحياة اليومية" --audience "شباب 18-35" --angle "شرح سريع ومفيد"
node src/index.js script list
```

## إنتاج فيديو محلي

```bash
node src/index.js video render --script-id "script-..."
node src/index.js video status
node src/index.js video mark-failed "video-..." "تم اكتشاف خطأ في النص أو الملف"
```

## التشغيل داخل GitHub Actions

يوجد ملف سير عمل مجدول جاهز في:

- `.github/workflows/shorts-scheduler.yml`

يتم تشغيله:

- يدوياً عبر `workflow_dispatch`
- أو مجدولًا يوميًا عبر cron

لا يتم رفع الفيديوهات إلى YouTube خلال هذه المرحلة، فقط التشغيل المحلي أو داخل CI مع حفظ Artifact في GitHub.

## ملاحظات مهمة

- لا تُخزن المفاتيح أو الرموز في المستودع.
- لا يتم النشر التلقائي على YouTube في هذه المرحلة.
- يحتاج أي رفع فعلي إلى OAuth آمن عبر GitHub Secrets.
- إذا لم يتوفر FFmpeg، يتم تسجيل الحالة كـ "skipped" بدلًا من الفشل المفاجئ.

## بنية المشروع

```text
src/
  index.js
  idea-generator.js
  script-manager.js
  store.js
  video-engine.js
.data/
  library.json
  ideas.json
  scripts.json
  videos.json
  output/
```

## حدود المشروع

- لا يوجد نشر تلقائي إلى YouTube في هذه المرحلة
- لا يعتمد على خدمات مدفوعة
- يعتمد على ملفات محلية فقط، مع دعم اختياري للملفات الموجودة في النظام
- كل خطوة تحتاج إلى مراجعة بشرية قبل النشر النهائي
