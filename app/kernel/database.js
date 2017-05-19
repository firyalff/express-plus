'use strict';

const Sequelize = require('sequelize')
, path = require('path')
, option = (process.env.NODE_ENV==='local-dev')?'local-dev/':''
, selected = require(`./../configs/${option}database`)[process.env.NODE_ENV].usage
, config = require(`./../configs/${option}database`)[process.env.NODE_ENV][selected];

exports.sequelize = new Sequelize(config.database, config.username, config.password, config);