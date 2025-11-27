import * as vscode from 'vscode';
import { SECRET_KEY_ID } from './constants';

export async function getStoredClientKey(
	context: vscode.ExtensionContext
): Promise<string | undefined> {
	return context.secrets.get(SECRET_KEY_ID);
}

export async function ensureClientKey(
	context: vscode.ExtensionContext
): Promise<string | undefined> {
	const existing = await getStoredClientKey(context);
	if (existing) {
		return existing;
	}

	const key = await vscode.window.showInputBox({
		title: 'Code Tracker: Enter client key',
		placeHolder: 'Paste your Code Tracker client key',
		prompt: 'This key will be used to authorize saving notebook states.',
		ignoreFocusOut: true,
		password: true
	});

	if (!key) {
		void vscode.window.showWarningMessage(
			'Code Tracker: client key is required to send notebook state.'
		);
		return undefined;
	}

	await context.secrets.store(SECRET_KEY_ID, key);
	void vscode.window.showInformationMessage('Code Tracker: client key saved.');
	return key;
}

export async function configureClientKey(
	context: vscode.ExtensionContext
): Promise<void> {
	const current = await getStoredClientKey(context);

	const key = await vscode.window.showInputBox({
		title: 'Code Tracker: Configure client key',
		value: current ?? '',
		placeHolder: 'Paste your Code Tracker client key',
		prompt: 'Update the key used to authorize saving notebook states.',
		ignoreFocusOut: true,
		password: true
	});

	if (!key) {
		void vscode.window.showWarningMessage(
			'Code Tracker: client key not changed.'
		);
		return;
	}

	await context.secrets.store(SECRET_KEY_ID, key);
	void vscode.window.showInformationMessage('Code Tracker: client key updated.');
}


