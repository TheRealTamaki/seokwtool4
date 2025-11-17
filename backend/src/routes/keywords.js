const express = require('express');
const router = express.Router();
const { Keyword, Project } = require('../models');
const { protect } = require('../middleware/auth');
const { keywordValidation, validate } = require('../middleware/validators');

// @route   GET /api/keywords/project/:projectId
// @desc    Get all keywords for a project
// @access  Private
router.get('/project/:projectId', protect, async (req, res, next) => {
  try {
    // Verify project belongs to user
    const project = await Project.findOne({
      where: {
        id: req.params.projectId,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const keywords = await Keyword.findAll({
      where: { projectId: req.params.projectId },
      order: [['searchVolume', 'DESC']]
    });

    res.json({
      success: true,
      count: keywords.length,
      data: keywords
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/keywords
// @desc    Add keyword to project
// @access  Private
router.post('/', protect, keywordValidation, validate, async (req, res, next) => {
  try {
    const { projectId, keyword, searchVolume, keywordDifficulty, cpc, competition, trend, notes, tags, metadata } = req.body;

    // Verify project belongs to user
    const project = await Project.findOne({
      where: {
        id: projectId,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check if keyword already exists in project
    const existingKeyword = await Keyword.findOne({
      where: {
        projectId,
        keyword
      }
    });

    if (existingKeyword) {
      return res.status(400).json({
        success: false,
        error: 'Keyword already exists in this project'
      });
    }

    const newKeyword = await Keyword.create({
      projectId,
      keyword,
      searchVolume,
      keywordDifficulty,
      cpc,
      competition,
      trend,
      notes,
      tags,
      metadata
    });

    res.status(201).json({
      success: true,
      data: newKeyword
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/keywords/bulk
// @desc    Add multiple keywords to project
// @access  Private
router.post('/bulk', protect, async (req, res, next) => {
  try {
    const { projectId, keywords } = req.body;

    if (!projectId || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Project ID and keywords array are required'
      });
    }

    // Verify project belongs to user
    const project = await Project.findOne({
      where: {
        id: projectId,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Prepare keywords data
    const keywordsData = keywords.map(kw => ({
      projectId,
      keyword: kw.keyword,
      searchVolume: kw.searchVolume || 0,
      keywordDifficulty: kw.keywordDifficulty || 0,
      cpc: kw.cpc || 0,
      competition: kw.competition || 0,
      trend: kw.trend || null,
      notes: kw.notes || null,
      tags: kw.tags || [],
      metadata: kw.metadata || null
    }));

    const createdKeywords = await Keyword.bulkCreate(keywordsData, {
      ignoreDuplicates: true
    });

    res.status(201).json({
      success: true,
      count: createdKeywords.length,
      data: createdKeywords
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/keywords/:id
// @desc    Update keyword
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    const keyword = await Keyword.findByPk(req.params.id, {
      include: [{
        model: Project,
        as: 'project',
        where: { userId: req.user.id }
      }]
    });

    if (!keyword) {
      return res.status(404).json({
        success: false,
        error: 'Keyword not found'
      });
    }

    const { notes, tags } = req.body;

    if (notes !== undefined) keyword.notes = notes;
    if (tags !== undefined) keyword.tags = tags;

    await keyword.save();

    res.json({
      success: true,
      data: keyword
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/keywords/:id
// @desc    Delete keyword
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const keyword = await Keyword.findByPk(req.params.id, {
      include: [{
        model: Project,
        as: 'project',
        where: { userId: req.user.id }
      }]
    });

    if (!keyword) {
      return res.status(404).json({
        success: false,
        error: 'Keyword not found'
      });
    }

    await keyword.destroy();

    res.json({
      success: true,
      message: 'Keyword deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
