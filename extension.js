// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const process = require("process");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const createFlask = vscode.commands.registerCommand("flask-vgs.createFlask", (uri) => {
      // Kill all running terminals
      vscode.window.terminals.forEach((t) => {
        t.dispose();
      });

      const terminal = vscode.window.createTerminal("flask-terminal");
      terminal.show();
      terminal.sendText(`cd "${uri.fsPath}"`);
      terminal.sendText("npx degit https://github.com/thorcc/flask-it1 .");
      if (process.platform == "win32") {
        terminal.sendText("py -3 -m venv venv");
        terminal.sendText("venv\\Scripts\\activate");
      } else {
        terminal.sendText("python3 -m venv venv");
        terminal.sendText(". venv/bin/activate");
      }
      terminal.sendText("pip install -r requirements.txt");
      terminal.sendText("flask run");
    }
  );
  const runFlask = vscode.commands.registerCommand("flask-vgs.runFlask", (uri) => {
      // Kill all running terminals
      vscode.window.terminals.forEach((t) => {
        t.dispose();
      });

      const terminal = vscode.window.createTerminal("flask-terminal");
      terminal.show();
      terminal.sendText(`cd "${uri.fsPath}"`);
      terminal.sendText("npx degit https://github.com/thorcc/flask-it1 .");
      if (process.platform == "win32") {
        terminal.sendText("venv\\Scripts\\activate");
      } else {
        terminal.sendText(". venv/bin/activate");
      }
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
