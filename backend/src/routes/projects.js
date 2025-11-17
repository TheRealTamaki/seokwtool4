const express = require('express');
const router = express.Router();
const { Project, Keyword } = require('../models');
const { protect } = require('../middleware/auth');
const { projectValidation, validate } = require('../middleware/validators');

// @route   GET /api/projects
// @desc    Get all projects for current user
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const projects = await Project.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Keyword,
        as: 'keywords'
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [{
        model: Keyword,
        as: 'keywords',
        order: [['searchVolume', 'DESC']]
      }]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', protect, projectValidation, validate, async (req, res, next) => {
  try {
    const { name, description, targetLocation, targetLanguage } = req.body;

    const project = await Project.create({
      userId: req.user.id,
      name,
      description,
      targetLocation,
      targetLanguage
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', protect, projectValidation, validate, async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const { name, description, targetLocation, targetLanguage } = req.body;

    project.name = name || project.name;
    project.description = description !== undefined ? description : project.description;
    project.targetLocation = targetLocation || project.targetLocation;
    project.targetLanguage = targetLanguage || project.targetLanguage;

    await project.save();

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    await project.destroy();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
