"use strict";

const fs = require("fs")
, path = require("path");

var ctrl = {};

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach((file) => {
    ctrl[file.split(".")[0]] = require(path.join(__dirname, file));

  });

module.exports =  ctrl;