
const espree = require('espree');
const fs = require('fs-extra');

const metricsService = {
  calculateFileMetrics(code) {
    console.log('[metricsService] Calculating file metrics...');
    let cyclomaticComplexity = 1;
    let functionCount = 0;
    let classCount = 0;
    let linesOfCode = 0;

    const lines = code.split('\n');
    linesOfCode = lines.filter(line => line.trim().length > 0).length;

    try {
      const ast = espree.parse(code, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        loc: true
      });

      const traverse = (node) => {
          if (!node) return;

          if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') {
            functionCount++;
          }
          if (node.type === 'ClassDeclaration' || node.type === 'ClassExpression') {
            classCount++;
          }
          if (['IfStatement', 'ForStatement', 'ForInStatement', 'ForOfStatement', 'WhileStatement', 'DoWhileStatement', 'SwitchStatement', 'TryStatement', 'CatchClause'].includes(node.type)) {
            cyclomaticComplexity++;
          }
          if (node.type === 'LogicalExpression' && (node.operator === '&&' || node.operator === '||')) {
            cyclomaticComplexity++;
          }
          if (node.type === 'ConditionalExpression') {
            cyclomaticComplexity++;
          }

          for (const key in node) {
            if (node.hasOwnProperty(key)) {
              const child = node[key];
              if (Array.isArray(child)) {
                child.forEach(traverse);
              } else if (child && typeof child === 'object') {
                  traverse(child);
              }
            }
          }
      };

      traverse(ast);
    } catch (err) {
      console.error('[metricsService] Error parsing AST:', err);
    }

    const metrics = {
      cyclomaticComplexity,
      functionCount,
      classCount,
      linesOfCode,
      fileComplexity: cyclomaticComplexity
    };
    console.log('[metricsService] File metrics calculated:', metrics);
    return metrics;
  },

  calculateProjectMetrics(fileMetricsList) {
    console.log('[metricsService] Calculating project metrics for', fileMetricsList.length, 'files');
    let totalCyclomaticComplexity = 0;
    let totalFunctionCount = 0;
    let totalClassCount = 0;
    let totalLinesOfCode = 0;
    let maxFileComplexity = 0;

    for (const metrics of fileMetricsList) {
      totalCyclomaticComplexity += metrics.cyclomaticComplexity;
      totalFunctionCount += metrics.functionCount;
      totalClassCount += metrics.classCount;
      totalLinesOfCode += metrics.linesOfCode;
      if (metrics.fileComplexity > maxFileComplexity) {
        maxFileComplexity = metrics.fileComplexity;
      }
    }

    const projectMetrics = {
      totalCyclomaticComplexity,
      totalFunctionCount,
      totalClassCount,
      totalLinesOfCode,
      averageCyclomaticComplexity: fileMetricsList.length > 0 ? totalCyclomaticComplexity / fileMetricsList.length : 0,
      maxFileComplexity,
      fileCount: fileMetricsList.length
    };
    console.log('[metricsService] Project metrics calculated:', projectMetrics);
    return projectMetrics;
  },

  async analyzeFiles(filePaths) {
    console.log('[metricsService] Analyzing metrics for files:', filePaths);
    const fileMetricsList = [];

    for (const filePath of filePaths) {
      try {
        const code = await fs.readFile(filePath, 'utf-8');
        const fileMetrics = this.calculateFileMetrics(code);
        fileMetricsList.push({
          filePath,
          ...fileMetrics
        });
      } catch (err) {
        console.error(`[metricsService] Error reading file ${filePath}:`, err);
      }
    }

    const result = {
      files: fileMetricsList,
      project: this.calculateProjectMetrics(fileMetricsList)
    };
    console.log('[metricsService] Files analysis complete');
    return result;
  },

  async analyzeCode(code) {
    console.log('[metricsService] Analyzing pasted code...');
    const fileMetrics = this.calculateFileMetrics(code);
    const result = {
      files: [{ filePath: 'temp-code.js', ...fileMetrics }],
      project: this.calculateProjectMetrics([fileMetrics])
    };
    console.log('[metricsService] Pasted code analysis complete');
    return result;
  }
};

module.exports = metricsService;
