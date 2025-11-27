import * as vscode from 'vscode';
import { configureClientKey } from './keyStore';
import { registerSettingsPanel } from './settingsPanel';
import { sendNotebookState } from './trackerApi';
import { registerNotebookWatcher } from './notebookWatcher';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {
	console.log('Code Tracker extension is active.');

	const configureClientKeyCommand = vscode.commands.registerCommand(
		'code-tracker.configureClientKey',
		async () => {
			await configureClientKey(context);
		}
	);

	const openSettingsCommand = registerSettingsPanel(context);

	const sendNotebookStateCommand = vscode.commands.registerCommand(
		'code-tracker.sendNotebookState',
		async () => {
			const editor = vscode.window.activeNotebookEditor;

			if (!editor) {
				void vscode.window.showInformationMessage(
					'Code Tracker: no active notebook editor.'
				);
				return;
			}

			await sendNotebookState(context, editor.notebook);
		}
	);

	const outputChangeListener = registerNotebookWatcher(context);

	context.subscriptions.push(
		openSettingsCommand,
		configureClientKeyCommand,
		sendNotebookStateCommand,
		outputChangeListener
	);
}

// This method is called when your extension is deactivated
export function deactivate(): void {
	// Nothing to clean up explicitly; disposables are in subscriptions.
}

