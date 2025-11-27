import * as vscode from 'vscode';
import { sendNotebookState } from './trackerApi';

export function registerNotebookWatcher(
	context: vscode.ExtensionContext
): vscode.Disposable {
	return vscode.workspace.onDidChangeNotebookDocument(async (event) => {
		// Only track Jupyter notebooks
		if (event.notebook.notebookType !== 'jupyter-notebook') {
			return;
		}

		console.log('Notebook document changed, sending state.');
		await sendNotebookState(context, event.notebook);
	});
}


