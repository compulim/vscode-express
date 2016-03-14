# Express
## Hosts your current workspace in Express

![Demo showing how Express extension works](https://raw.githubusercontent.com/compulim/vscode-express/master/demo.gif)

## Usage
To host your current space in Express and then open in your default browser.
* Bring up Command Palette (`F1`, or `Ctrl+Shift+P` on Windows and Linux, or `Shift+CMD+P` on OSX)
* Type or select "Express: Host current workspace and open in browser"

By default, Express server will be hosted on port 80. You can configure it in preferences, along with other settings.

```js
// Specifies the port number the Express server should listen to
"express.portNumber": 80,

// Determines whether to omit informational messages
"express.omitInformationMessage": false,

// Specifies the path to be hosted on Express, relative to the workspace root
"express.relativeRoot": null,
```

## Change log
* 0.0.1 (2016-03-14): First public release

## Contributions
Love this extension? [Star](https://github.com/compulim/vscode-express/stargazers) us!

Want to make this extension even more awesome? [Send us your wish](https://github.com/compulim/vscode-express/issues/new/).

Hate how it is working? [File an issue](https://github.com/compulim/vscode-express/issues/new/) to us.
