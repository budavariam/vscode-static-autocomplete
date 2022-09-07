// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// launch.json configuration
const config = vscode.workspace.getConfiguration(
	// 'launch',
	// vscode.workspace.workspaceFolders?[0]?.uri
);

/*
// example config.json
{
"vscode-static-autocomplete": {
    "pattern": "todo.md",
    "triggers": {
		"@": [
		  {
			"label": "user",
			"filterText": "fullName",
			"detail": "relevant info",
			"kind": 25
		  }
		],
		"#": [
		  {
			"label": "projectName",
			"filterText": "projectName",
			"detail": "project Descriptor",
			"kind": 20
		  }
		],
	  }
	}
}
*/

interface ExtensionSettings {
	triggers: ACValues,
	pattern?: string,
}
interface ACValues {
	[key: string]: []
}
// retrieve values
const values: ExtensionSettings = config.get('vscode-static-autocomplete') ?? { triggers: {} };

function generateStaticAutocompleteItemsFromConfig(values: ExtensionSettings) {
	return {
		values: values.triggers,
		triggers: Object.keys(values),
	}
}

const pregenerated = generateStaticAutocompleteItemsFromConfig(values)
console.log(pregenerated)

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations!!! your extension "vscode-static-autocomplete" is now active!');

	const autocompleteProvider = vscode.languages.registerCompletionItemProvider(
		{ scheme: 'file', language: 'markdown', pattern: values?.pattern ?? undefined },
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				return pregenerated.values[linePrefix.slice(-1)] || undefined
				// if (linePrefix.endsWith('@')) {
				// 	return [
				// 		{ ...new vscode.CompletionItem('abc', vscode.CompletionItemKind.User), filterText: 'aábc', detail: "Alphabet" },
				// 	];
				// }
				// if (linePrefix.endsWith('!')) {
				// 	return [
				// 		new vscode.CompletionItem('selectedIcon', vscode.CompletionItemKind.Constant),
				// 		new vscode.CompletionItem('icon1', 1),
				// 		new vscode.CompletionItem('icon2', 2),
				// 		new vscode.CompletionItem('icon3', 3),
				// 		new vscode.CompletionItem('icon4', 4),
				// 		new vscode.CompletionItem('icon5', 5),
				// 		new vscode.CompletionItem('icon6', 6),
				// 		new vscode.CompletionItem('icon7', 7),
				// 		new vscode.CompletionItem('icon8', 8),
				// 		new vscode.CompletionItem('icon9', 9),
				// 		new vscode.CompletionItem('icon10', 10),
				// 		new vscode.CompletionItem('icon11', 11),
				// 		new vscode.CompletionItem('icon12', 12),
				// 		new vscode.CompletionItem('icon13', 13),
				// 		new vscode.CompletionItem('icon14', 14),
				// 		new vscode.CompletionItem('icon15', 15),
				// 		new vscode.CompletionItem('icon16', 16),
				// 		new vscode.CompletionItem('icon17', 17),
				// 		new vscode.CompletionItem('icon18', 18),
				// 		new vscode.CompletionItem('icon19', 19),
				// 		new vscode.CompletionItem('icon20', 20),
				// 		new vscode.CompletionItem('icon21', 21),
				// 		new vscode.CompletionItem('icon22', 22),
				// 		new vscode.CompletionItem('icon23', 23),
				// 		new vscode.CompletionItem('icon24', 24),
				// 		new vscode.CompletionItem('icon25', 25),
				// 		new vscode.CompletionItem('icon26', 26),
				// 	];
				// }

				return undefined;
			}
		},
		...pregenerated.triggers// triggered whenever a char is being typed
	);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-static-autocomplete.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from vscode-static-autocomplete!');
	});

	context.subscriptions.push(autocompleteProvider, disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
