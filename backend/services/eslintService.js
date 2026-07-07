
const { ESLint } = require('eslint');
const path = require('path');
const fs = require('fs-extra');

const eslintService = {
  async analyzeFiles(filePaths) {
    console.log('[eslintService] Running ESLint analysis on files:', filePaths);
    const eslint = new ESLint({
      overrideConfig: {
        env: {
          browser: true,
          es2021: true,
          node: true
        },
        extends: ['eslint:recommended'],
        parserOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module',
          ecmaFeatures: {
            jsx: true
          }
        },
        rules: {
          'no-unused-vars': 'warn',
          'no-console': 'warn',
          'no-undef': 'error',
          'semi': 'warn',
          'quotes': ['warn', 'single']
        }
      },
      useEslintrc: false
    });

    const results = await eslint.lintFiles(filePaths);
    const formattedResults = [];

    for (const result of results) {
      const fileResult = {
        filePath: result.filePath,
        errors: result.errorCount,
        warnings: result.warningCount,
        messages: result.messages.map(msg => ({
          ruleId: msg.ruleId,
          severity: msg.severity === 1 ? 'warning' : 'error',
          message: msg.message,
          line: msg.line,
          column: msg.column
        }))
      };
      formattedResults.push(fileResult);
    }

    console.log('[eslintService] ESLint analysis complete:', formattedResults);
    return formattedResults;
  },

  async analyzeCode(code, tempDir) {
    console.log('[eslintService] Analyzing pasted code...');
    const tempFile = path.join(tempDir, 'temp-code.js');
    await fs.writeFile(tempFile, code);
    const results = await this.analyzeFiles([tempFile]);
    await fs.remove(tempFile);
    console.log('[eslintService] Pasted code analysis complete');
    return results;
  }
};

module.exports = eslintService;
