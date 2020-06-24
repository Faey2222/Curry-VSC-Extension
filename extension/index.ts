import * as vscode from 'vscode';

const snippets = require('../snippets/snippets.json');

type Snippet = {
  body: Array<string> | string;
  description: string;
  prefix: Array<string> | string;
};

const convertSnippetArrayToString = (snippetArray: Array<string>): string => snippetArray.join('\n');

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.snippetSearch', async () => {
    const items = Object.entries(snippets as Array<Snippet>).map(([shortDescription, { prefix, body, description }], index) => {
      const value = typeof prefix === 'string' ? prefix : prefix[0];

      return {
        id: index,
        description: description || shortDescription,
        label: value,
        value,
        body,
      };
    });

    const options = {
      matchOnDescription: true,
      matchOnDetail: true,
      placeHolder: 'Search snippet',
    };

    const snippet = (await vscode.window.showQuickPick(items, options)) || { body: '' };
    const activeTextEditor = vscode.window.activeTextEditor;
    const body = typeof snippet.body === 'string' ? snippet.body : convertSnippetArrayToString(snippet.body);
    activeTextEditor && activeTextEditor.insertSnippet(new vscode.SnippetString(body));
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
