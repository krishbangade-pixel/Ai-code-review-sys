require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const config = require('./config');
const reviewRoutes = require('./routes/reviewRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(helmet());

app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log('========================================');
  console.log(`${req.method} ${req.originalUrl}`);
  console.log('Time:', new Date().toLocaleString());
  console.log('========================================');
  next();
});

// Routes
app.use('/api/review', reviewRoutes);
app.use('/api/reviews', reviewRoutes);

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Code Review API is running!',
    version: '1.0.0',
    endpoints: {
      reviewCode: 'POST /api/review/code',
      reviewUpload: 'POST /api/review/upload',
      reviewGithub: 'POST /api/review/github',
      getReviews: 'GET /api/reviews',
      getReview: 'GET /api/reviews/:id',
      deleteReview: 'DELETE /api/reviews/:id'
    }
  });
});

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(config.port, () => {
  console.log('');
  console.log('========================================');
  console.log('🚀 AI Code Review Backend Started');
  console.log(`🌍 URL : http://localhost:${config.port}`);
  console.log(`📦 Mode: ${config.nodeEnv}`);
  try {
    const fs = require('fs');
    const stats = fs.statSync(require.resolve('./services/geminiService'));
    console.log('⚙️  geminiService.js mtime:', stats.mtime.toISOString());
  } catch (e) {
    console.warn('Could not stat geminiService.js to verify running file');
  }
  console.log('========================================');
  console.log('');
});
