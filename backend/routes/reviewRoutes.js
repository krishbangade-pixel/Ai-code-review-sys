
const express = require('express');
const reviewController = require('../controllers/reviewController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/code', reviewController.reviewCode);
router.post('/upload', upload.array('files', 20), reviewController.reviewUpload);
router.post('/github', reviewController.reviewGitHub);
router.get('/', reviewController.getReviews);
router.get('/:id', reviewController.getReviewById);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
