'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const
  open = require('open'),
  path = require('path'),
  ServerInstance = require('./serverinstance'),
  vscode = require('vscode');

const
  server = new ServerInstance();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "vscode-express" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(vscode.commands.registerCommand('express.hostWorkspace', function () {
    // The code you place here will be executed every time your command is executed
    hostWorkspace(false);
  }));

  context.subscriptions.push(vscode.commands.registerCommand('express.hostWorkspaceAndOpenInBrowser', function () {
    // The code you place here will be executed every time your command is executed
    hostWorkspace(true);
  }));

  context.subscriptions.push(vscode.commands.registerCommand('express.stopServer', function () {
    stopServer();
  }));

  context.subscriptions.push(vscode.commands.registerCommand('express.openInBrowser', function () {
    const portNumber = server.portNumber;

    if (portNumber) {
      openInBrowser(portNumber);
    } else {
      vscode.window.showErrorMessage('No Express server is running');
    }
  }));
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}

exports.deactivate = deactivate;

function getCustomConfiguration() {
  return vscode.workspace.getConfiguration('express') || {};
}

function openInBrowser(portNumber) {
  openInBrowser && open(`http://localhost:${portNumber}/`);
}

function hostWorkspace(shouldOpenInBrowser) {
  const
    config = getCustomConfiguration(),
    portNumber = config.portNumber || 80,
    wwwRoot = vscode.workspace.rootPath;

  if (!wwwRoot) {
    return vscode.window.showErrorMessage('Please open a folder or workspace before starting Express server');
  }

  server
    .start(portNumber, path.resolve(wwwRoot, config.relativeRoot || '.'))
    .then(
      () => {
        !config.omitInformationMessage && vscode.window.showInformationMessage(`Express server is started and listening to port ${portNumber}`);
        shouldOpenInBrowser && openInBrowser(portNumber);
      },
      err => {
        if (err.message === 'already started') {
          vscode.window.showInformationMessage('Express server is already running');
        } else if (err.code === 'EADDRINUSE') {
          vscode.window.showErrorMessage(`Port number ${portNumber} is already in use`);
        } else {
          vscode.window.showErrorMessage(err.message);
        }
      }
    );
}

function stopServer() {
  const
    config = getCustomConfiguration(),
    timeout = setTimeout(() => {
      !config.omitInformationMessage && vscode.window.showInformationMessage('Express server is stopping, it may take a while');
    }, 1000);

  server
    .stop()
    .then(
      () => {
        clearTimeout(timeout);
        !config.omitInformationMessage && vscode.window.showInformationMessage('Express server has been stopped');
      },
      () => {
        clearTimeout(timeout);
        vscode.window.showWarningMessage('Express server is not running');
      }
    );
}