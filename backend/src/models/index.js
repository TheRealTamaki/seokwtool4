const { sequelize, testConnection } = require('../config/database');
const User = require('./User');
const Project = require('./Project');
const Keyword = require('./Keyword');

// Define associations
User.hasMany(Project, {
  foreignKey: 'userId',
  as: 'projects',
  onDelete: 'CASCADE'
});

Project.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Project.hasMany(Keyword, {
  foreignKey: 'projectId',
  as: 'keywords',
  onDelete: 'CASCADE'
});

Keyword.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project'
});

// Sync database
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force, alter: !force });
    console.log(`✓ Database synced successfully ${force ? '(dropped and recreated)' : '(updated schema)'}`);
  } catch (error) {
    console.error('✗ Error syncing database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection,
  User,
  Project,
  Keyword,
  syncDatabase
};
