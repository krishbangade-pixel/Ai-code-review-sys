
const eslintService = require('./eslintService');
const metricsService = require('./metricsService');
const geminiService = require('./geminiService');
const fileUtils = require('../utils/fileUtils');
const gitService = require('./gitService');
const supabaseService = require('./supabaseService');
const fs = require('fs-extra');
const path = require('path');

const reviewService = {
  async reviewCode(code, userId, projectName) {
    console.log('[reviewService] Starting code review for user:', userId);
    const tempDir = await fileUtils.createTempDir();

    try {
      console.log('[reviewService] Running ESLint analysis...');
      const staticAnalysis = await eslintService.analyzeCode(code, tempDir);

      console.log('[reviewService] Calculating metrics...');
      const metrics = await metricsService.analyzeCode(code);

      console.log('[reviewService] Performing AI review (Gemini)...');
      console.log('[reviewService] Calling geminiService.performReview with code length:', code?.length || 0);
      let aiReview;
      try {
        aiReview = await geminiService.performReview(code, staticAnalysis, metrics);
        console.log('[reviewService] Received aiReview from Gemini:', JSON.stringify(aiReview, null, 2));
      } catch (err) {
        console.error('[reviewService] Error from geminiService.performReview:', err && err.stack ? err.stack : err);
        throw err;
      }

      const reviewData = {
        user_id: userId,
        type: 'code',
        code: code,
        static_analysis: staticAnalysis,
        metrics: metrics,
        ai_review: aiReview,
        overall_score: aiReview.overallScore,
        project_name: projectName && projectName.trim() ? projectName.trim() : 'Untitled Review',
        status: 'completed'
      };

      console.log('[reviewService] Saving reviewData to Supabase:', JSON.stringify(reviewData, null, 2));
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

  async reviewFiles(files, userId, projectName) {
    console.log('[reviewService] Starting file review for user:', userId, 'with', files.length, 'files');
    const tempDir = await fileUtils.createTempDir();

    try {
      console.log('[reviewService] Saving uploaded files...');
      for (const file of files) {
        const targetPath = path.join(tempDir, file.originalname);
        await fs.writeFile(targetPath, file.buffer);
      }

      const jsFiles = await fileUtils.getJsFiles(tempDir);
      console.log('[reviewService] Found', jsFiles.length, 'supported files for analysis');

      if (jsFiles.length === 0) {
        throw new Error('No supported files found in upload');
      }

      console.log('[reviewService] Running ESLint analysis...');
      const staticAnalysis = await eslintService.analyzeFiles(jsFiles);

      console.log('[reviewService] Calculating metrics...');
      const metrics = await metricsService.analyzeFiles(jsFiles);

      const fileContents = await fileUtils.readFiles(jsFiles);
      const combinedCode = fileUtils.combineCode(fileContents);

      console.log('[reviewService] Performing AI review (Gemini)...');
      const aiReview = await geminiService.performReview(combinedCode, staticAnalysis, metrics);

      const reviewData = {
        user_id: userId,
        type: 'upload',
        code: combinedCode,
        files: jsFiles,
        static_analysis: staticAnalysis,
        metrics: metrics,
        ai_review: aiReview,
        overall_score: aiReview.overallScore,
        project_name: projectName && projectName.trim() ? projectName.trim() : 'Untitled Review',
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

  async reviewGitHubRepo(repoUrl, userId, projectName) {
    console.log('[reviewService] Starting GitHub repository review for user:', userId, 'repo:', repoUrl);
    let tempDir;

    try {
      console.log('[reviewService] Cloning and analyzing repository...');
      const { files, tempDir: clonedDir } = await gitService.analyzeRepo(repoUrl);
      tempDir = clonedDir;

      const jsFiles = await fileUtils.getJsFiles(tempDir);
      console.log('[reviewService] Found', jsFiles.length, 'supported files for analysis');

      if (jsFiles.length === 0) {
        throw new Error('No supported files found in repository');
      }

      console.log('[reviewService] Running ESLint analysis...');
      const staticAnalysis = await eslintService.analyzeFiles(jsFiles);

      console.log('[reviewService] Calculating metrics...');
      const metrics = await metricsService.analyzeFiles(jsFiles);

      const combinedCode = fileUtils.combineCode(files);

      console.log('[reviewService] Performing AI review (Gemini)...');
      const aiReview = await geminiService.performReview(combinedCode, staticAnalysis, metrics);

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
        project_name: projectName && projectName.trim() ? projectName.trim() : repoUrl,
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
