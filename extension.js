// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const process = require("process");
const fs = require('fs')
const util = require('util');

const makeDir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);



const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flask - VGS</title>
</head>
<body>
    <h1>Hallo, {{navn}}!</h1>
</body>
</html>

`

const appTemplate = `from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def hello_world():
    navn = "Sandvika"
    return render_template("index.html", navn=navn)

`

const requirementsTemplate = `certifi==2021.10.8
charset-normalizer==2.0.12
click==8.0.4
Flask==2.0.3
idna==3.3
itsdangerous==2.1.0
Jinja2==3.0.3
MarkupSafe==2.1.0
requests==2.27.1
urllib3==1.26.9
Werkzeug==2.0.3
python-dotenv==0.19.2

`

const flaskenvTemplate = `FLASK_APP=app
FLASK_ENV=development

`

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const createFlask = vscode.commands.registerCommand("flask-vgs.createFlask", async uri => {
      // Kill all running terminals
      vscode.window.terminals.forEach((t) => {
        t.dispose();
      });

      // Create Flask template
      await makeDir(`${uri.fsPath}/templates`);
      await writeFile(`${uri.fsPath}/templates/index.html`, htmlTemplate);
      await writeFile(`${uri.fsPath}/app.py`, appTemplate);
      await writeFile(`${uri.fsPath}/requirements.txt`, requirementsTemplate);
      await writeFile(`${uri.fsPath}/.flaskenv`, flaskenvTemplate);
      
      // Create virtual environment
      const terminal = vscode.window.createTerminal("flask-terminal");
      terminal.show();
      terminal.sendText(`cd "${uri.fsPath}"`);
      if (process.platform == "win32") { // win32 = windows
        terminal.sendText("py -3 -m venv venv");
        terminal.sendText("venv\\Scripts\\activate");
      } else {
        terminal.sendText("python3 -m venv venv");
        terminal.sendText(". venv/bin/activate");
      }

      // Install Python libraries
      terminal.sendText("pip install -r requirements.txt");

      // Run Flask
      terminal.sendText("flask run");
    }
  );
  const runFlask = vscode.commands.registerCommand("flask-vgs.runFlask", (uri) => {
      // Kill all running terminals
      vscode.window.terminals.forEach((t) => {
        t.dispose();
      });

      // Activate environment
      const terminal = vscode.window.createTerminal("flask-terminal");
      terminal.show();
      terminal.sendText(`cd "${uri.fsPath}"`);
      if (process.platform == "win32") {
        terminal.sendText("venv\\Scripts\\activate");
      } else {
        terminal.sendText(". venv/bin/activate");
      }

      // Run Flask
      terminal.sendText("flask run");
    }
  );

  context.subscriptions.push(createFlask, runFlask);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
