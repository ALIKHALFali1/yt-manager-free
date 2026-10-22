#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.join(process.cwd(), '.data');
const libraryFile = path.join(dataDir, 'library.json');

function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(libraryFile)) {
    fs.writeFileSync(libraryFile, '[]', 'utf8');
  }
}

function readLibrary() {
  ensureStore();
  const raw = fs.readFileSync(libraryFile, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLibrary(items) {
  fs.writeFileSync(libraryFile, JSON.stringify(items, null, 2), 'utf8');
}

function showHelp() {
  console.log(`
YT Manager Free

Usage:
  node src/index.js add <youtube-url>
  node src/index.js list
  node src/index.js remove <index>
  node src/index.js clear
  node src/index.js help
`);
}

function addItem(url) {
  if (!url) {
    console.error('A YouTube URL is required.');
    process.exit(1);
  }

  const items = readLibrary();
  const exists = items.some((item) => item.url === url);

  if (exists) {
    console.log('This URL is already in your library.');
    return;
  }

  const item = {
    id: Date.now(),
    url,
    addedAt: new Date().toISOString(),
  };

  items.push(item);
  saveLibrary(items);
  console.log(`Added: ${url}`);
}

function listItems() {
  const items = readLibrary();

  if (!items.length) {
    console.log('Your library is empty.');
    return;
  }

  items.forEach((item, index) => {
    console.log(`${index + 1}. ${item.url}`);
  });
}

function removeItem(indexValue) {
  const index = Number(indexValue) - 1;
  const items = readLibrary();

  if (!Number.isInteger(index) || index < 0 || index >= items.length) {
    console.error('Invalid item index.');
    process.exit(1);
  }

  const removed = items.splice(index, 1)[0];
  saveLibrary(items);
  console.log(`Removed: ${removed.url}`);
}

function clearLibrary() {
  saveLibrary([]);
  console.log('Library cleared.');
}

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case 'add':
    addItem(args[0]);
    break;
  case 'list':
    listItems();
    break;
  case 'remove':
    removeItem(args[0]);
    break;
  case 'clear':
    clearLibrary();
    break;
  case 'help':
  case '--help':
  case '-h':
  default:
    showHelp();
    break;
}
