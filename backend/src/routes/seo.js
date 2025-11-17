const express = require('express');
const router = express.Router();
const dataforSEOService = require('../services/dataforseo');
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// @route   POST /api/seo/research
// @desc    Comprehensive keyword research
// @access  Private
router.post('/research',
  protect,
  [
    body('keyword').trim().notEmpty().withMessage('Keyword is required'),
    body('locationCode').optional().isInt().withMessage('Location code must be an integer'),
    body('languageCode').optional().isString().withMessage('Language code must be a string')
  ],
  validate,
  async (req, res, next) => {
    try {
      const { keyword, locationCode = 2840, languageCode = 'en' } = req.body;

      const data = await dataforSEOService.comprehensiveKeywordResearch(
        keyword,
        locationCode,
        languageCode
      );

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   POST /api/seo/related-keywords
// @desc    Get related keywords
// @access  Private
router.post('/related-keywords',
  protect,
  [
    body('keyword').trim().notEmpty().withMessage('Keyword is required'),
    body('locationCode').optional().isInt(),
    body('languageCode').optional().isString(),
    body('limit').optional().isInt().withMessage('Limit must be an integer')
  ],
  validate,
  async (req, res, next) => {
    try {
      const { keyword, locationCode = 2840, languageCode = 'en', limit = 50 } = req.body;

      const keywords = await dataforSEOService.getRelatedKeywords(
        keyword,
        locationCode,
        languageCode,
        limit
      );

      res.json({
        success: true,
        count: keywords.length,
        data: keywords
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   POST /api/seo/keyword-suggestions
// @desc    Get keyword suggestions
// @access  Private
router.post('/keyword-suggestions',
  protect,
  [
    body('keyword').trim().notEmpty().withMessage('Keyword is required'),
    body('locationCode').optional().isInt(),
    body('languageCode').optional().isString(),
    body('limit').optional().isInt()
  ],
  validate,
  async (req, res, next) => {
    try {
      const { keyword, locationCode = 2840, languageCode = 'en', limit = 50 } = req.body;

      const keywords = await dataforSEOService.getKeywordSuggestions(
        keyword,
        locationCode,
        languageCode,
        limit
      );

      res.json({
        success: true,
        count: keywords.length,
        data: keywords
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   POST /api/seo/keyword-metrics
// @desc    Get metrics for multiple keywords
// @access  Private
router.post('/keyword-metrics',
  protect,
  [
    body('keywords').isArray().withMessage('Keywords must be an array'),
    body('keywords.*').trim().notEmpty().withMessage('Each keyword must be a non-empty string'),
    body('locationCode').optional().isInt(),
    body('languageCode').optional().isString()
  ],
  validate,
  async (req, res, next) => {
    try {
      const { keywords, locationCode = 2840, languageCode = 'en' } = req.body;

      const metrics = await dataforSEOService.getKeywordMetrics(
        keywords,
        locationCode,
        languageCode
      );

      res.json({
        success: true,
        count: metrics.length,
        data: metrics
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   POST /api/seo/domain-keywords
// @desc    Get keywords for a domain
// @access  Private
router.post('/domain-keywords',
  protect,
  [
    body('domain').trim().notEmpty().withMessage('Domain is required'),
    body('locationCode').optional().isInt(),
    body('languageCode').optional().isString(),
    body('limit').optional().isInt()
  ],
  validate,
  async (req, res, next) => {
    try {
      const { domain, locationCode = 2840, languageCode = 'en', limit = 100 } = req.body;

      const keywords = await dataforSEOService.getKeywordsForDomain(
        domain,
        locationCode,
        languageCode,
        limit
      );

      res.json({
        success: true,
        count: keywords.length,
        data: keywords
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   POST /api/seo/serp-data
// @desc    Get SERP data including PAA and AI Overview
// @access  Private
router.post('/serp-data',
  protect,
  [
    body('keyword').trim().notEmpty().withMessage('Keyword is required'),
    body('locationCode').optional().isInt(),
    body('languageCode').optional().isString()
  ],
  validate,
  async (req, res, next) => {
    try {
      const { keyword, locationCode = 2840, languageCode = 'en' } = req.body;

      const serpData = await dataforSEOService.getSERPData(
        keyword,
        locationCode,
        languageCode
      );

      res.json({
        success: true,
        data: serpData
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
