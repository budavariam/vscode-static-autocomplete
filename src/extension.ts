// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

/**
 * kind: values of the vscode.CompletionItemKind enum
 * example config.json:
   ```json
   "vscode-static-autocomplete.pattern": "todo.md",
	"vscode-static-autocomplete.triggers": {
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
   ```
**/
function loadValues(): ParsedAutocompleteData {
	// launch.json configuration
	const config = vscode.workspace.getConfiguration(
		// 'launch',
		// vscode.workspace.workspaceFolders?[0]?.uri
	);
	// retrieve values
	const values: ExtensionSettings = config.get('vscode-static-autocomplete') ?? { triggers: {} };
	return generateStaticAutocompleteItemsFromConfig(values)
}

interface ExtensionSettings {
	triggers: ACValues,
	pattern?: string,
}
interface ACValues {
	[key: string]: []
}

interface ParsedAutocompleteData {
	values: ACValues
	triggers: string[],
	pattern?: string,
}

function generateStaticAutocompleteItemsFromConfig(values: ExtensionSettings) : ParsedAutocompleteData {
	return {
		values: values.triggers,
		triggers: Object.keys(values),
		pattern: values.pattern,
	}
}

let pregenerated: ParsedAutocompleteData = loadValues()
// console.log(pregenerated)

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations! your extension "vscode-static-autocomplete" is now active!');

	const autocompleteProvider = vscode.languages.registerCompletionItemProvider(
		{ scheme: 'file', language: 'markdown', pattern: pregenerated?.pattern ?? undefined },
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				return pregenerated.values[linePrefix.slice(-1)] || undefined
			}
		},
		...pregenerated.triggers // triggered whenever a char is being typed out of these items
	);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-static-autocomplete.reloadValues', () => {
		// The code you place here will be executed every time your command is executed
		pregenerated = loadValues()
		// Display a message box to the user
		vscode.window.showInformationMessage(`Reloaded the values of vscode-static-autocomplete!`);
	});

	context.subscriptions.push(autocompleteProvider, disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
