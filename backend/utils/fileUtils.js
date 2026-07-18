
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const IGNORED_DIRS = ['node_modules', 'dist', 'build', '.git', 'coverage', '.next', 'out'];
const JS_EXTENSIONS = [
  '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.json', '.html', '.css', '.txt', '.md', '.yaml', '.yml',
  '.py', '.java', '.c', '.cpp', '.h', '.cs', '.go', '.rs'
];

const fileUtils = {
  async createTempDir() {
    console.log('[fileUtils] Creating temporary directory...');
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'code-review-'));
    console.log('[fileUtils] Temporary directory created at:', tempDir);
    return tempDir;
  },

  async removeTempDir(dirPath) {
    console.log('[fileUtils] Removing temporary directory:', dirPath);
    await fs.remove(dirPath);
    console.log('[fileUtils] Temporary directory removed');
  },

  async getJsFiles(dirPath, rootDir = dirPath) {
    console.log('[fileUtils] Scanning for JS/JSX files in:', dirPath);
    const files = [];
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.includes(entry.name)) {
          const subFiles = await this.getJsFiles(fullPath, rootDir);
          files.push(...subFiles);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (JS_EXTENSIONS.includes(ext)) {
          files.push(fullPath);
        }
      }
    }

    console.log('[fileUtils] Found', files.length, 'JS/JSX files');
    return files;
  },

  async readFiles(filePaths) {
    console.log('[fileUtils] Reading', filePaths.length, 'files...');
    const files = [];
    for (const filePath of filePaths) {
      const content = await fs.readFile(filePath, 'utf-8');
      files.push({
        path: filePath,
        content
      });
    }
    console.log('[fileUtils] All files read successfully');
    return files;
  },

  combineCode(files) {
    console.log('[fileUtils] Combining', files.length, 'files for analysis');
    return files.map(file => `// ${file.path}\n${file.content}`).join('\n\n');
  }
};

module.exports = fileUtils;
