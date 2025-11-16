const express = require('express');
const { getAIRecommendations } = require('../controllers/aiRecommendationController');

const router = express.Router();

// POST /api/ai-recommendations - Get AI-based doctor recommendations
router.post('/', getAIRecommendations);

module.exports = router;