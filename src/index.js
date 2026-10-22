
import { createStore } from './store.js';
import { generateStoryIdea } from './idea-generator.js';

const store = createStore();

function showHelp() {
  console.log(`
مدير يوتيوب مجاني - YT Manager Free

الاستخدام:
  node src/index.js help
  node src/index.js add <رابط يوتيوب> [title="عنوان الفيديو"]
  node src/index.js list
  node src/index.js remove <id>
  node src/index.js clear
  node src/index.js idea generate [topic="الموضوع"]
  node src/index.js idea list
  node src/index.js idea show <id>

أمثلة:
  node src/index.js add "https://www.youtube.com/watch?v=VIDEO_ID" title="فيديو مفيد"
  node src/index.js list
  node src/index.js idea generate topic="الذكاء الاصطناعي"
  node src/index.js idea list
`);
}

function parseKeyValueArgs(args) {
  const result = {};

  for (const arg of args) {
    const separator = arg.indexOf('=');

    if (separator === -1) continue;

    const key = arg.slice(0, separator).trim();
    const value = arg.slice(separator + 1).trim();

    if (key) {
      result[key] = value.replace(/^["']|["']$/g, '');
    }
  }

  return result;
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isValidYouTubeUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');

    if (host === 'youtu.be') {
      return url.pathname.length > 1;
    }

    if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'music.youtube.com'
    ) {
      return (
        url.pathname === '/watch' && url.searchParams.has('v')
      ) || (
        url.pathname.startsWith('/shorts/') &&
        url.pathname.length > 8
      ) || (
        url.pathname.startsWith('/embed/') &&
        url.pathname.length > 7
      );
    }

    return false;
  } catch {
    return false;
  }
}

function addItem(args) {
  const url = args[0];

  if (!url || !isValidYouTubeUrl(url)) {
    console.error('خطأ: أدخل رابط يوتيوب صحيحًا.');
    console.log('مثال: node src/index.js add "https://youtu.be/VIDEO_ID"');
    process.exitCode = 1;
    return;
  }

  const options = parseKeyValueArgs(args.slice(1));
  const items = store.readLibrary();

  const duplicate = items.find((item) => item.url === url);

  if (duplicate) {
    console.log('هذا الرابط موجود بالفعل في المكتبة.');
    console.log(`المعرّف: ${duplicate.id}`);
    return;
  }

  const item = {
    id: createId(),
    url,
    title: options.title || 'فيديو بدون عنوان',
    notes: options.notes || '',
    createdAt: new Date().toISOString()
  };

  items.push(item);
  store.saveLibrary(items);

  console.log('تمت إضافة الفيديو بنجاح.');
  console.log(`العنوان: ${item.title}`);
  console.log(`المعرّف: ${item.id}`);
}

function listItems() {
  const items = store.readLibrary();

  if (!items.length) {
    console.log('المكتبة فارغة. أضف رابط يوتيوب باستخدام الأمر add.');
    return;
  }

  console.log('\nمكتبة فيديوهات يوتيوب:\n');

  for (const item of items) {
    console.log(`العنوان: ${item.title}`);
    console.log(`الرابط: ${item.url}`);
    console.log(`المعرّف: ${item.id}`);

    if (item.notes) {
      console.log(`ملاحظات: ${item.notes}`);
    }

    console.log('-------------------------');
  }

  console.log(`إجمالي الفيديوهات: ${items.length}`);
}

function removeItem(args) {
  const id = args[0];

  if (!id) {
    console.error('يرجى تحديد معرّف الفيديو المراد حذفه.');
    process.exitCode = 1;
    return;
  }

  const items = store.readLibrary();
  const updatedItems = items.filter((item) => item.id !== id);

  if (updatedItems.length === items.length) {
    console.log('لم يتم العثور على فيديو بهذا المعرّف.');
    return;
  }

  store.saveLibrary(updatedItems);
  console.log('تم حذف الفيديو بنجاح.');
}

function clearLibrary() {
  const items = store.readLibrary();

  if (!items.length) {
    console.log('المكتبة فارغة بالفعل.');
    return;
  }

  store.saveLibrary([]);
  console.log(`تم حذف ${items.length} فيديو من المكتبة.`);
}

function handleIdeaGenerate(args) {
  const options = parseKeyValueArgs(args);

  const topic = options.topic || 'معلومات عامة';
  const audience = options.audience || 'الجمهور العام';
  const angle = options.angle || 'محتوى مفيد وجذاب';
  const language = options.language || 'ar';

  const idea = generateStoryIdea({
    topic,
    audience,
    angle,
    language
  });

  const ideas = store.readIdeas();
  ideas.push(idea);
  store.saveIdeas(ideas);

  console.log('\nتم إنشاء فكرة جديدة بنجاح!\n');
  console.log(`العنوان: ${idea.title}`);
  console.log(`الموضوع: ${idea.topic}`);
  console.log(`الخطاف: ${idea.hook}`);
  console.log(`المعرّف: ${idea.id}`);
  console.log(`الحالة: ${idea.status}`);

  if (Array.isArray(idea.scriptOutline) && idea.scriptOutline.length) {
    console.log('\nمخطط السكريبت:');

    for (const step of idea.scriptOutline) {
      if (typeof step === 'string') {
        console.log(`- ${step}`);
      } else {
        console.log(`- ${step.title || step.heading || 'الخطوة'}`);

        if (step.content) {
          console.log(`  ${step.content}`);
        }
      }
    }
  }

  if (Array.isArray(idea.sources) && idea.sources.length) {
    console.log('\nمصادر مقترحة للتحقق:');

    for (const source of idea.sources) {
      if (typeof source === 'string') {
        console.log(`- ${source}`);
      } else {
        console.log(`- ${source.name || source.title || 'مصدر مقترح'}`);

        if (source.note || source.notes) {
          console.log(`  ${source.note || source.notes}`);
        }
      }
    }
  }

  console.log('\nراجع المعلومات والمصادر قبل نشر الفيديو.');
}

function handleIdeaList() {
  const ideas = store.readIdeas();

  if (!ideas.length) {
    console.log('لا توجد أفكار محفوظة حتى الآن.');
    return;
  }

  console.log('\nالأفكار المحفوظة:\n');

  for (const idea of ideas) {
    console.log(`العنوان: ${idea.title}`);
    console.log(`الموضوع: ${idea.topic || 'غير محدد'}`);
    console.log(`المعرّف: ${idea.id}`);
    console.log(`الحالة: ${idea.status || 'مسودة'}`);
    console.log('-------------------------');
  }

  console.log(`إجمالي الأفكار: ${ideas.length}`);
}

function handleIdeaShow(args) {
  const id = args[0];

  if (!id) {
    console.error('يرجى تحديد معرّف الفكرة.');
    process.exitCode = 1;
    return;
  }

  const idea = store.readIdeas().find((item) => item.id === id);

  if (!idea) {
    console.log('لم يتم العثور على الفكرة المطلوبة.');
    return;
  }

  console.log('\nتفاصيل الفكرة\n');
  console.log(JSON.stringify(idea, null, 2));
}

function main() {
  store.ensureStore();

  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case 'help':
    case '--help':
    case '-h':
    case undefined:
      showHelp();
      break;

    case 'add':
      addItem(args);
      break;

    case 'list':
      listItems();
      break;

    case 'remove':
      removeItem(args);
      break;

    case 'clear':
      clearLibrary();
      break;

    case 'idea': {
      const [action, ...ideaArgs] = args;

      switch (action) {
        case 'generate':
          handleIdeaGenerate(ideaArgs);
          break;

        case 'list':
          handleIdeaList();
          break;

        case 'show':
          handleIdeaShow(ideaArgs);
          break;

        default:
          console.log('أمر الأفكار غير معروف.');
          console.log('الاستخدام: idea generate أو idea list أو idea show <id>');
          process.exitCode = 1;
      }

      break;
    }

    default:
      console.error(`أمر غير معروف: ${command}`);
      showHelp();
      process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  console.error('حدث خطأ أثناء تشغيل البرنامج.');

  if (process.env.DEBUG === '1') {
    console.error(error);
  } else {
    console.error('لإظهار تفاصيل الخطأ، شغّل الأمر مع DEBUG=1.');
  }

  process.exitCode = 1;
}
