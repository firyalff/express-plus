'use strict';

const fs = require("fs")
, path = require("path")
, Sequelize = require("sequelize")
, sequelize = require('./../kernel/database').sequelize;

var db = {};

fs
.readdirSync(__dirname)
.filter((file) => {
  return (file.indexOf(".") !== 0) && (file !== "index.js");
})
.forEach((file) => {
  var model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;