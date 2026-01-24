const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Baza SQLite w tym folderze
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite')
});

const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING
  },
  year: {
    type: DataTypes.INTEGER
  }
}, {
  timestamps: false
});

module.exports = { Book, sequelize };
