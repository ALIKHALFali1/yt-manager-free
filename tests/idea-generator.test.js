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

أوامر الأفكار/القصص:
  node src/index.js idea generate --topic "قصة قصيرة عن الذكاء الاصطناعي" --audience "شباب 18-35" --angle "شرح عملي ومفيد"
  node src/index.js idea list
  node src/index.js idea show <idea-id>
`);
}

function addItem(url) {
  if (!url) {
    console.error('مطلوب رابط YouTube صالح.');
    process.exit(1);
  }

  const items = store.readLibrary();
  const exists = items.some((item) => item.url === url);

  if (exists) {
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
  console.log(`تمت الإضافة: ${url}`);
}

function listItems() {
  const items = store.readLibrary();

  if (!items.length) {
    console.log('المكتبة فارغة حاليًا.');
    return;
  }

  items.forEach((item, index) => {
    console.log(`${index + 1}. ${item.url}`);
  });
}

function removeItem(indexValue) {
  const index = Number(indexValue) - 1;
  const items = store.readLibrary();

  if (!Number.isInteger(index) || index < 0 || index >= items.length) {
    console.error('رقم العنصر غير صحيح.');
    process.exit(1);
  }

  const removed = items.splice(index, 1)[0];
  store.saveLibrary(items);
  console.log(`تم الحذف: ${removed.url}`);
}

function clearLibrary() {
  store.saveLibrary([]);
  console.log('تم مسح المكتبة.');
}

function parseKeyValueArgs(args) {
  const result = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (!arg.startsWith('--')) {
      continue;
    }

    const [key, rawValue] = arg.split('=');
    const value = rawValue ?? args[i + 1];

    if (!value || value.startsWith('--')) {
      result[key.replace(/^--/, '')] = '';
      continue;
    }

    result[key.replace(/^--/, '')] = value;

    if (!rawValue) {
      i += 1;
    }
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
    hook: idea.hook,
    status: idea.status,
    sources: idea.sources,
    verificationChecklist: idea.verificationChecklist
  }, null, 2));
}

function handleIdeaList() {
  const ideas = store.readIdeas();

  if (!ideas.length) {
    console.log('لا توجد أفكار محفوظة حاليًا.');
    return;
  }

  ideas.forEach((idea, index) => {
    console.log(`${index + 1}. [${idea.status}] ${idea.title}`);
  });
}

function handleIdeaShow(ideaId) {
  const ideas = store.readIdeas();
  const idea = ideas.find((item) => item.id === ideaId);

  if (!idea) {
    console.error('لم يتم العثور على فكرة بهذا المعرف.');
    process.exit(1);
  }

  console.log(JSON.stringify(idea, null, 2));
}

const [command, subcommand, ...args] = process.argv.slice(2);

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
    if (subcommand === 'generate') {
      handleIdeaGenerate(args);
      break;
    }

    if (subcommand === 'list') {
      handleIdeaList();
      break;
    }

    if (subcommand === 'show') {
      handleIdeaShow(args[0]);
      break;
    }

    showHelp();
    break;
  case 'help':
  case '--help':
  case '-h':
  default:
    showHelp();
    break;
}
