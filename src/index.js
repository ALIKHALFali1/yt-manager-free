
#!/usr/bin/env node

import { createStore } from './store.js';
import { generateStoryIdea } from './idea-generator.js';

const store = createStore();

function showHelp() {
  console.log(`
YT Manager Free

الأوامر الأساسية:
  node src/index.js add <youtube-url>
  node src/index.js list
  node src/index.js remove <index>
  node src/index.js clear
  node src/index.js help

أوامر الأفكار والقصص:
  node src/index.js idea generate --topic "قصة قصيرة عن الذكاء الاصطناعي" --audience "شباب 18-35" --angle "شرح عملي ومفيد"
  node src/index.js idea list
  node src/index.js idea show <idea-id>
`);
}

function addItem(url) {
  if (
    !url ||
    !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(url)
  ) {
    console.error('من فضلك أدخل رابط YouTube صالحًا.');
    process.exitCode = 1;
    return;
  }

  const items = store.readLibrary();

  if (items.some((item) => item.url === url)) {
    console.log('هذا الرابط موجود بالفعل في المكتبة.');
    return;
  }

  const item = {
    id: Date.now(),
    url,
    addedAt: new Date().toISOString()
  };

  items.push(item);
  store.saveLibrary(items);

  console.log(`تمت إضافة الرابط بنجاح: ${url}`);
}

function listItems() {
  const items = store.readLibrary();

  if (!items.length) {
    console.log('المكتبة فارغة حاليًا.');
    return;
  }

  items.forEach((item, index) => {
    console.log(`${index + 1}. ${item.url}`);
    console.log(`   تاريخ الإضافة: ${item.addedAt}`);
  });
}

function removeItem(indexValue) {
  const index = Number(indexValue) - 1;
  const items = store.readLibrary();

  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= items.length
  ) {
    console.error('رقم العنصر غير صحيح.');
    process.exitCode = 1;
    return;
  }

  const removed = items.splice(index, 1)[0];

  store.saveLibrary(items);
  console.log(`تم حذف الرابط: ${removed.url}`);
}

function clearLibrary() {
  store.saveLibrary([]);
  console.log('تم مسح مكتبة الروابط.');
}

function parseKeyValueArgs(args) {
  const result = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (!arg.startsWith('--')) {
      continue;
    }

    const equalIndex = arg.indexOf('=');
    let key;
    let value;

    if (equalIndex !== -1) {
      key = arg.slice(2, equalIndex);
      value = arg.slice(equalIndex + 1);
    } else {
      key = arg.slice(2);
      value = args[i + 1] ?? '';

      if (value && !value.startsWith('--')) {
        i += 1;
      } else {
        value = '';
      }
    }

    result[key] = value;
  }

  return result;
}

function handleIdeaGenerate(args) {
  const opts = parseKeyValueArgs(args);

  const idea = generateStoryIdea({
    topic: opts.topic || 'قصص ومعلومات عربية',
    audience: opts.audience || 'شباب 18-35',
    angle: opts.angle || 'تفسير سريع ومفيد',
    language: opts.language || 'ar'
  });

  const ideas = store.readIdeas();

  ideas.unshift(idea);
  store.saveIdeas(ideas);

  console.log(JSON.stringify({
    id: idea.id,
    title: idea.title,
    slug: idea.slug,
    topic: idea.topic,
    audience: idea.audience,
    angle: idea.angle,
    hook: idea.hook,
    scriptOutline: idea.scriptOutline,
    sources: idea.sources,
    verificationChecklist: idea.verificationChecklist,
    status: idea.status,
    createdAt: idea.createdAt
  }, null, 2));

  console.log('\nتم إنشاء الفكرة وحفظها بنجاح.');
}

function handleIdeaList() {
  const ideas = store.readIdeas();

  if (!ideas.length) {
    console.log('لا توجد أفكار محفوظة حاليًا.');
    return;
  }

  ideas.forEach((idea, index) => {
    console.log(`${index + 1}. [${idea.status}] ${idea.title}`);
    console.log(`   المعرف: ${idea.id}`);
  });
}

function handleIdeaShow(ideaId) {
  if (!ideaId) {
    console.error('من فضلك أدخل معرف الفكرة.');
    process.exitCode = 1;
    return;
  }

  const ideas = store.readIdeas();
  const idea = ideas.find((item) => item.id === ideaId);

  if (!idea) {
    console.error('لم يتم العثور على فكرة بهذا المعرف.');
    process.exitCode = 1;
    return;
  }

  console.log(JSON.stringify(idea, null, 2));
}

function handleIdeaCommand(subcommand, args) {
  switch (subcommand) {
    case 'generate':
      handleIdeaGenerate(args);
      break;

    case 'list':
      handleIdeaList();
      break;

    case 'show':
      handleIdeaShow(args[0]);
      break;

    default:
      showHelp();
  }
}

const [command, subcommand, ...args] = process.argv.slice(2);

try {
  switch (command) {
    case 'add':
      addItem(subcommand);
      break;

    case 'list':
      listItems();
      break;

    case 'remove':
      removeItem(subcommand);
      break;

    case 'clear':
      clearLibrary();
      break;

    case 'idea':
    case 'ideas':
    case 'story':
      handleIdeaCommand(subcommand, args);
      break;

    case 'help':
    case '--help':
    case '-h':
    default:
      showHelp();
      break;
  }
} catch (error) {
  console.error('حدث خطأ أثناء تنفيذ الأمر:', error.message);
  process.exitCode = 1;
}
