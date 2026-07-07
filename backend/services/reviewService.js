
const eslintService = require('./eslintService');
const metricsService = require('./metricsService');
const openAiService = require('./openAiService');
const fileUtils = require('../utils/fileUtils');
const gitService = require('./gitService');
const supabaseService = require('./supabaseService');
const fs = require('fs-extra');
const path = require('path');

const reviewService = {
  async reviewCode(code, userId) {
    console.log('[reviewService] Starting code review for user:', userId);
    const tempDir = await fileUtils.createTempDir();

    try {
      console.log('[reviewService] Running ESLint analysis...');
      const staticAnalysis = await eslintService.analyzeCode(code, tempDir);

      console.log('[reviewService] Calculating metrics...');
      const metrics = await metricsService.analyzeCode(code);

      console.log('[reviewService] Performing AI review...');
      const aiReview = await openAiService.performReview(code, staticAnalysis, metrics);

      const reviewData = {
        user_id: userId,
        type: 'code',
        code: code,
        static_analysis: staticAnalysis,
        metrics: metrics,
        ai_review: aiReview,
        overall_score: aiReview.overallScore,
        status: 'completed'
      };

      console.log('[reviewService] Saving review to database...');
      const savedReview = await supabaseService.saveReview(reviewData);
      console.log('[reviewService] Code review complete!');
      return savedReview;
    } catch (error) {
      console.error('[reviewService] Error during code review:', error);
      throw error;
    } finally {
      await fileUtils.removeTempDir(tempDir);
    }
  },

  async reviewFiles(files, userId) {
    console.log('[reviewService] Starting file review for user:', userId, 'with', files.length, 'files');
    const tempDir = await fileUtils.createTempDir();

    try {
      console.log('[reviewService] Saving uploaded files...');
      for (const file of files) {
        const targetPath = path.join(tempDir, file.originalname);
        await fs.writeFile(targetPath, file.buffer);
      }

      const jsFiles = await fileUtils.getJsFiles(tempDir);
      console.log('[reviewService] Found', jsFiles.length, 'JS/JSX files for analysis');

      if (jsFiles.length === 0) {
        throw new Error('No JS/JSX files found in upload');
      }

      console.log('[reviewService] Running ESLint analysis...');
      const staticAnalysis = await eslintService.analyzeFiles(jsFiles);

      console.log('[reviewService] Calculating metrics...');
      const metrics = await metricsService.analyzeFiles(jsFiles);

      const fileContents = await fileUtils.readFiles(jsFiles);
      const combinedCode = fileUtils.combineCode(fileContents);

      console.log('[reviewService] Performing AI review...');
      const aiReview = await openAiService.performReview(combinedCode, staticAnalysis, metrics);

      const reviewData = {
        user_id: userId,
        type: 'upload',
        code: combinedCode,
        files: jsFiles,
        static_analysis: staticAnalysis,
        metrics: metrics,
        ai_review: aiReview,
        overall_score: aiReview.overallScore,
        status: 'completed'
      };

      console.log('[reviewService] Saving review to database...');
      const savedReview = await supabaseService.saveReview(reviewData);
      console.log('[reviewService] File review complete!');
      return savedReview;
    } catch (error) {
      console.error('[reviewService] Error during file review:', error);
      throw error;
    } finally {
      await fileUtils.removeTempDir(tempDir);
    }
  },

  async reviewGitHubRepo(repoUrl, userId) {
    console.log('[reviewService] Starting GitHub repository review for user:', userId, 'repo:', repoUrl);
    let tempDir;

    try {
      console.log('[reviewService] Cloning and analyzing repository...');
      const { files, tempDir: clonedDir } = await gitService.analyzeRepo(repoUrl);
      tempDir = clonedDir;

      const jsFiles = await fileUtils.getJsFiles(tempDir);
      console.log('[reviewService] Found', jsFiles.length, 'JS/JSX files for analysis');

      if (jsFiles.length === 0) {
        throw new Error('No JS/JSX files found in repository');
      }

      console.log('[reviewService] Running ESLint analysis...');
      const staticAnalysis = await eslintService.analyzeFiles(jsFiles);

      console.log('[reviewService] Calculating metrics...');
      const metrics = await metricsService.analyzeFiles(jsFiles);

      const combinedCode = fileUtils.combineCode(files);

      console.log('[reviewService] Performing AI review...');
      const aiReview = await openAiService.performReview(combinedCode, staticAnalysis, metrics);

      const reviewData = {
        user_id: userId,
        type: 'github',
        repo_url: repoUrl,
        code: combinedCode,
        files: jsFiles,
        static_analysis: staticAnalysis,
        metrics: metrics,
        ai_review: aiReview,
        overall_score: aiReview.overallScore,
        status: 'completed'
      };

      console.log('[reviewService] Saving review to database...');
      const savedReview = await supabaseService.saveReview(reviewData);
      console.log('[reviewService] GitHub repository review complete!');
      return savedReview;
    } catch (error) {
      console.error('[reviewService] Error during GitHub review:', error);
      throw error;
    } finally {
      if (tempDir) {
        await fileUtils.removeTempDir(tempDir);
      }
    }
  }
};

module.exports = reviewService;
