const reviewService = require('../services/reviewService');
const supabaseService = require('../services/supabaseService');

const reviewController = {
  async reviewCode(req, res) {
    console.log('\n==============================');
    console.log('[POST] /api/review/code');
    console.log('Request Body:', req.body);
    console.log('==============================\n');

    try {
      const { code, user_id } = req.body;

      if (!code) {
        return res.status(400).json({
          error: 'Code is required'
        });
      }

      if (!user_id) {
        return res.status(400).json({
          error: 'User ID is required'
        });
      }

      const review = await reviewService.reviewCode(code, user_id);

      console.log('✅ Review created successfully');

      res.json({
        success: true,
        review
      });

    } catch (error) {

      console.error('\n==========================================');
      console.error('❌ REVIEW CODE FAILED');
      console.error('==========================================');
      console.error('Message:');
      console.error(error.message);
      console.error('\nStack Trace:');
      console.error(error.stack);
      console.error('==========================================\n');

      res.status(500).json({
        success: false,
        error: 'Failed to review code',
        message: error.message,
        stack:
          process.env.NODE_ENV === 'development'
            ? error.stack
            : undefined
      });
    }
  },

  async reviewUpload(req, res) {
    console.log('\n==============================');
    console.log('[POST] /api/review/upload');
    console.log('==============================\n');

    try {
      const { user_id } = req.body;
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({
          error: 'No files uploaded'
        });
      }

      if (!user_id) {
        return res.status(400).json({
          error: 'User ID is required'
        });
      }

      const review = await reviewService.reviewFiles(files, user_id);

      console.log('✅ Upload review completed');

      res.json({
        success: true,
        review
      });

    } catch (error) {

      console.error('\n==========================================');
      console.error('❌ REVIEW UPLOAD FAILED');
      console.error('==========================================');
      console.error(error.message);
      console.error(error.stack);
      console.error('==========================================\n');

      res.status(500).json({
        success: false,
        error: 'Failed to review files',
        message: error.message,
        stack:
          process.env.NODE_ENV === 'development'
            ? error.stack
            : undefined
      });
    }
  },

  async reviewGitHub(req, res) {
    console.log('\n==============================');
    console.log('[POST] /api/review/github');
    console.log('==============================\n');

    try {
      const { repo_url, user_id } = req.body;

      if (!repo_url) {
        return res.status(400).json({
          error: 'Repository URL is required'
        });
      }

      if (!user_id) {
        return res.status(400).json({
          error: 'User ID is required'
        });
      }

      const review = await reviewService.reviewGitHubRepo(repo_url, user_id);

      console.log('✅ GitHub review completed');

      res.json({
        success: true,
        review
      });

    } catch (error) {

      console.error('\n==========================================');
      console.error('❌ GITHUB REVIEW FAILED');
      console.error('==========================================');
      console.error(error.message);
      console.error(error.stack);
      console.error('==========================================\n');

      res.status(500).json({
        success: false,
        error: 'Failed to review repository',
        message: error.message,
        stack:
          process.env.NODE_ENV === 'development'
            ? error.stack
            : undefined
      });
    }
  },

  async getReviews(req, res) {
    try {

      const { user_id } = req.query;

      if (!user_id) {
        return res.status(400).json({
          error: 'User ID is required'
        });
      }

      const reviews = await supabaseService.getReviews(user_id);

      res.json({
        success: true,
        reviews
      });

    } catch (error) {

      console.error(error);
      console.error(error.stack);

      res.status(500).json({
        success: false,
        error: 'Failed to fetch reviews',
        message: error.message,
        stack:
          process.env.NODE_ENV === 'development'
            ? error.stack
            : undefined
      });
    }
  },

  async getReviewById(req, res) {
    try {

      const { id } = req.params;
      const { user_id } = req.query;

      if (!user_id) {
        return res.status(400).json({
          error: 'User ID is required'
        });
      }

      const review = await supabaseService.getReviewById(id, user_id);

      res.json({
        success: true,
        review
      });

    } catch (error) {

      console.error(error);
      console.error(error.stack);

      res.status(500).json({
        success: false,
        error: 'Failed to fetch review',
        message: error.message,
        stack:
          process.env.NODE_ENV === 'development'
            ? error.stack
            : undefined
      });
    }
  },

  async deleteReview(req, res) {
    try {

      const { id } = req.params;
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({
          error: 'User ID is required'
        });
      }

      const result = await supabaseService.deleteReview(id, user_id);

      res.json({
        success: true,
        result
      });

    } catch (error) {

      console.error(error);
      console.error(error.stack);

      res.status(500).json({
        success: false,
        error: 'Failed to delete review',
        message: error.message,
        stack:
          process.env.NODE_ENV === 'development'
            ? error.stack
            : undefined
      });
    }
  }
};

module.exports = reviewController;