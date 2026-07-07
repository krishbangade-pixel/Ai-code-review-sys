
const simpleGit = require('simple-git');
const fileUtils = require('../utils/fileUtils');

const gitService = {
  async cloneRepo(repoUrl, targetDir) {
    console.log('[gitService] Cloning repository:', repoUrl, 'into', targetDir);
    const git = simpleGit();
    await git.clone(repoUrl, targetDir);
    console.log('[gitService] Repository cloned successfully');
    return targetDir;
  },

  async analyzeRepo(repoUrl) {
    console.log('[gitService] Starting repository analysis:', repoUrl);
    const tempDir = await fileUtils.createTempDir();
    try {
      await this.cloneRepo(repoUrl, tempDir);
      const jsFiles = await fileUtils.getJsFiles(tempDir);
      const files = await fileUtils.readFiles(jsFiles);
      console.log('[gitService] Repository analysis complete');
      return { files, tempDir };
    } catch (error) {
      console.error('[gitService] Error analyzing repository:', error);
      await fileUtils.removeTempDir(tempDir);
      throw new Error(`Failed to clone/analyze repository: ${error.message}`);
    }
  }
};

module.exports = gitService;
