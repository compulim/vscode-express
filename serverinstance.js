'use strict';

const
  express = require('express'),
  http = require('http'),
  vscode = require('vscode');

class ServerInstance {
  constructor() {
    this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1);
  }

  start(portNumber, wwwRoot) {
    return new Promise((resolve, reject) => {
      if (this._server) {
        reject(new Error('already started'));
      } else {
        const app = express();

        app.use(express.static(wwwRoot));

        this._server = http.createServer(app).listen(portNumber, () => {
          this._statusBarItem.command = 'express.openInBrowser';
          this._statusBarItem.tooltip = `Express server is hosting ${wwwRoot}\n\nClick here to open in browser`;
          this._statusBarItem.text = `$(server)  Port ${portNumber}`;
          this._statusBarItem.show();

          this.portNumber = portNumber;

          resolve();
        }).on('error', err => {
          reject(err);
          this._server = null;
        });
      }
    });
  }

  stop() {
    return new Promise((resolve, reject) => {
      if (this._server) {
        this._server.close(() => {
          this._statusBarItem.hide();
          this._server = null;
          this.portNumber = null;

          resolve();
        });
      } else {
        reject(new Error('not running'));
      }
    });
  }

  dispose() {
    this.stop();
  }
}

module.exports = ServerInstance;