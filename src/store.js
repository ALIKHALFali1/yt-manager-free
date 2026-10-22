import fs from 'node:fs';
import path from 'node:path';

export function createStore(baseDir = process.cwd()) {
  const dataDir = path.join(baseDir, '.data');
  const libraryFile = path.join(dataDir, 'library.json');
  const ideasFile = path.join(dataDir, 'ideas.json');

  function ensureStore() {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(libraryFile)) {
      fs.writeFileSync(libraryFile, '[]', 'utf8');
    }

    if (!fs.existsSync(ideasFile)) {
      fs.writeFileSync(ideasFile, '[]', 'utf8');
    }
  }

  function readJson(filePath) {
    ensureStore();
    const raw = fs.readFileSync(filePath, 'utf8');

    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  function writeJson(filePath, data) {
    ensureStore();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  return {
    dataDir,
    libraryFile,
    ideasFile,
    ensureStore,
    readLibrary() {
      return readJson(libraryFile);
    },
    saveLibrary(items) {
      writeJson(libraryFile, items);
    },
    readIdeas() {
      return readJson(ideasFile);
    },
    saveIdeas(items) {
      writeJson(ideasFile, items);
    }
  };
}

export const store = createStore();
