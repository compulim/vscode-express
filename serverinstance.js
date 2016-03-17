'use strict';

const
  express = require('express'),
  http = require('http'),
  vscode = require('vscode'),
  window = vscode.window;

class ServerInstance {
  constructor() {
    this._statusBarItem = window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1);
  }

  start(portNumber, wwwRoot, shouldShowOutput) {
    if (!this._outputChannel) {
      this._outputChannel = window.createOutputChannel('Express');
      this._outputChannel.appendLine('(To hide this console when server start, set "express.showOutput" to false in preferences)');
    }

    shouldShowOutput && this._outputChannel.show(true);

    return new Promise((resolve, reject) => {
      if (this._server) {
        this._outputChannel.appendLine(`Server already started`);
        reject(new Error('already started'));
      } else {
        const app = express();

        this._outputChannel.appendLine(`Server is starting to listen to port ${portNumber} and will serve ${wwwRoot}`);

        app.use(express.static(wwwRoot));

        this._server = http.createServer(app).listen(portNumber, () => {
          this._statusBarItem.command = 'express.openInBrowser';
          this._statusBarItem.tooltip = `Express server is hosting ${wwwRoot}\n\nClick here to open in browser`;
          this._statusBarItem.text = `$(server)  Port ${portNumber}`;
          this._statusBarItem.show();

          this._outputChannel.appendLine(`Server started`);

          this.portNumber = portNumber;

          resolve();
        }).on('error', err => {
          this._outputChannel.appendLine(`Failed to start server due to ${err.message}`);
          reject(err);
          this._server = null;
        }).on('request', (req, res) => {
          this._outputChannel.appendLine(`${req.method} ${req.originalUrl}`);
        });
      }
    });
  }

  stop() {
    return new Promise((resolve, reject) => {
      if (this._server) {
        this._outputChannel.appendLine(`Server is stopping`);

        this._server.close(() => {
          this._server = null;
          this.portNumber = null;

          this._statusBarItem && this._statusBarItem.hide();

          if (this._outputChannel) {
            this._outputChannel.appendLine(`Server stopped`);
            this._outputChannel.hide();
          }

          resolve();
        });
      } else {
        this._outputChannel.appendLine(`Server was not running`);
        reject(new Error('not running'));
      }
    });
  }

  showOutputChannel() {
    this._outputChannel && this._outputChannel.show(true);
  }

  dispose() {
    this.stop();

    this._statusBarItem.dispose();
    this._statusBarItem = null;

    this._outputChannel.dispose();
    this._outputChannel = null;
  }
}

module.exports = ServerInstance;