'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const
  open = require('open'),
  path = require('path'),
  ServerInstance = require('./serverinstance'),
  vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  const
    server = new ServerInstance();

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "vscode-express" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(server);

  context.subscriptions.push(vscode.commands.registerCommand('express.hostWorkspace', portNumber => {
    const
      config = getCustomConfiguration(),
      wwwRoot = vscode.workspace.rootPath;

    portNumber = (typeof portNumber === 'number' || typeof portNumber === 'string') ? portNumber : (config.portNumber || 80);

    if (!wwwRoot) {
      return vscode.window.showErrorMessage('Please open a folder or workspace before starting Express server');
    }

    return server
      .start(portNumber, path.resolve(wwwRoot, config.relativeRoot || '.'))
      .then(
        () => {
          !config.omitInformationMessage && vscode.window.showInformationMessage(`Express server is started and listening to port ${portNumber}`);

          return portNumber;
        },
        err => {
          if (err.message === 'already started') {
            vscode.window.showErrorMessage('Express server is already running');
          } else if (err.code === 'EADDRINUSE') {
            vscode.window.showErrorMessage(`Port number ${portNumber} is already in use`);
          } else {
            vscode.window.showErrorMessage(err.message);
          }

          throw err;
        }
      );
  }));

  context.subscriptions.push(vscode.commands.registerCommand('express.hostWorkspaceAndOpenInBrowser', portNumber => {
    const config = getCustomConfiguration();

    portNumber = (typeof portNumber === 'number' || typeof portNumber === 'string') ? portNumber : (config.portNumber || 80);

    vscode.commands
      .executeCommand('express.hostWorkspace', portNumber)
      .then(portNumber => openInBrowser(portNumber));
  }));

  context.subscriptions.push(vscode.commands.registerCommand('express.hostWorkspaceWithRandomPort', () => {
    vscode.commands.executeCommand(
      'express.hostWorkspace',
      getRandomPortNumberFromConfiguration()
    );
  }));

  context.subscriptions.push(vscode.commands.registerCommand('express.hostWorkspaceWithRandomPortAndOpenInBrowser', () => {
    vscode.commands.executeCommand(
      'express.hostWorkspaceAndOpenInBrowser',
      getRandomPortNumberFromConfiguration()
    );
  }));

  context.subscriptions.push(vscode.commands.registerCommand('express.stopServer', () => {
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
        err => {
          clearTimeout(timeout);
          vscode.window.showWarningMessage('Express server is not running');

          throw err;
        }
      );
  }));

  context.subscriptions.push(vscode.commands.registerCommand('express.openInBrowser', () => {
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
  open(`http://localhost:${portNumber}/`);
}

function getRandomPortNumberFromConfiguration() {
  const
    config = getCustomConfiguration(),
    randomPortNumber = config.randomPortNumber;

  return getRandomPortNumber(randomPortNumber.min, randomPortNumber.max);
}

function getRandomPortNumber(min, max) {
  return Math.min(min, max) + Math.floor(Math.random() * (Math.abs(max - min) + 1));
}