# Express
Hosts current workspace with Express web server in Visual Studio Code

![Demo showing how Express extension works](https://raw.githubusercontent.com/compulim/vscode-express/master/demo.gif)

## Usage
To host your current workspace in Express with default port number (80), and then open in your default browser.
* Bring up Command Palette (`F1`, or `Ctrl+Shift+P` on Windows and Linux, or `Shift+CMD+P` on OSX)
* Type or select "Express: Host current workspace and open in browser"

When Express is up and ready, an icon will show up in the status bar ![Status bar item showing Express listening to port 80](https://raw.githubusercontent.com/compulim/vscode-express/master/statusbar.png). You can click on it to open your site in browser.

## Commands
| Command | Title |
|---------|-------------|
| `express.hostWorkspace(portNumber) ` | Express: Host Current Workspace |
| `express.hostWorkspaceAndOpenInBrowser(portNumber) ` | Express: Host Current Workspace and Open in Browser |
| `express.hostWorkspaceWithRandomPort ` | Express: Host Current Workspace with Random Port Number |
| `express.hostWorkspaceWithRandomPortAndOpenInBrowser ` | Express: Host Current Workspace with Random Port Number and open in browser |
| `express.openInBrowser` | Express: Open Currently Hosted Website in Browser |
| `express.showOutput` | Express: Show Output |
| `express.stopServer` | Express: Stop Server |

## Preferences

By default, the Express server is hosted on port 80. You can configure it to different port in preferences.

```js
// Specifies the port number the Express server should listen to
"express.portNumber": 80,

// Determines whether to omit informational messages
"express.omitInformationMessage": false,

// Specifies the path to be hosted on Express, relative to the workspace root
"express.relativeRoot": null,

// Specifies the minimum port number to use for random port number
"express.randomPortNumber.min": 8000,

// Specifies the maximum port number to use for random port number
"express.randomPortNumber.max": 8999,

// Determines whether to show output on server start
"express.showOutput": true,
```

Tips: Settings can be shared across team when overridden by workspace settings and checked into source control.

## Change log
* 0.0.3 (2016-03-16)
  * Show every request in output when server start
* 0.0.2 (2016-03-16)
  * Support both pre-configured or random port number
  * Call `vscode.commands.executeCommand('express.hostWorkspace', 8080)` to host on port 8080
  * Automatically stop server when extension is being deactivated
* 0.0.1 (2016-03-14): First public release

## Contributions
Love this extension? [Star](https://github.com/compulim/vscode-express/stargazers) us!

Want to make this extension even more awesome? [Send us your wish](https://github.com/compulim/vscode-express/issues/new/).

Hate how it is working? [File an issue](https://github.com/compulim/vscode-express/issues/new/) to us.
