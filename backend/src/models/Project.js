const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  targetLocation: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 2840 // United States
  },
  targetLanguage: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'en'
  }
}, {
  tableName: 'projects',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    }
  ]
});

module.exports = Project;
