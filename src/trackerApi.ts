import * as vscode from 'vscode';
import * as path from 'path';
import { TRACKER_API_ENDPOINT } from './constants';
import { ensureClientKey, getStoredClientKey } from './keyStore';

export interface TrackedFile {
	id: number;
	fileName: string;
	filePath: string;
	fullContent: string;
	timestamp: string;
	created_at: string;
}

export async function sendNotebookState(
	context: vscode.ExtensionContext,
	notebook: vscode.NotebookDocument
): Promise<void> {
	const uri = notebook.uri;

	try {
		const clientKey = await ensureClientKey(context);
		if (!clientKey) {
			return;
		}

		const fileBytes = await vscode.workspace.fs.readFile(uri);
		const fullContent = Buffer.from(fileBytes).toString('utf8');

		const payload = {
			fileName: path.basename(uri.fsPath),
			filePath: uri.fsPath,
			fullContent,
			timestamp: new Date().toISOString()
		};

		console.log('Sending clientKey:', clientKey);
		console.log('Sending payload:', JSON.stringify(payload));

		const response = await fetch(TRACKER_API_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'x-api-key': clientKey
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const errorText = await response.text().catch(() => '');
			throw new Error(
				`Request failed with status ${response.status}${
					errorText ? `: ${errorText}` : ''
				}`
			);
		}

		const result = (await response.json().catch(() => null)) as
			| {
					message?: string;
					data?: TrackedFile;
			  }
			| null;

		const confirmationMessage =
			result?.message ??
			(result?.data
				? `Notebook saved at ${result.data.created_at}`
				: 'Notebook state sent successfully.');

		void vscode.window.showInformationMessage(
			`Code Tracker: ${confirmationMessage}`
		);
	} catch (error) {
		console.error(error);
		void vscode.window.showErrorMessage(
			'Code Tracker: failed to send notebook state. See console for details.'
		);
	}
}

export async function fetchTrackedFiles(
	context: vscode.ExtensionContext
): Promise<TrackedFile[] | { data: TrackedFile[] } | null> {
	const key = await getStoredClientKey(context);
	if (!key) {
		throw new Error('No client key stored. Set a key first.');
	}

	const response = await fetch(TRACKER_API_ENDPOINT, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'x-api-key': key
		}
	});

	if (!response.ok) {
		const text = await response.text().catch(() => '');
		throw new Error(
			`Request failed with status ${response.status}${
				text ? `: ${text}` : ''
			}`
		);
	}

	return (await response.json()) as any;
}


