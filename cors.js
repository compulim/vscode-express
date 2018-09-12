'use strict';
const vscode = require('vscode');
function getConfig() {
  return vscode.workspace.getConfiguration('express') || {}
};

function addCors(app) {
  if (!getConfig().enableCors) return;

  // FROM: https://stackoverflow.com/a/31213399/2355482
  // Thank you cmlndz
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
      return res.send(200);
    } else {
      return next();
    }
  });
}

module.exports = addCors;