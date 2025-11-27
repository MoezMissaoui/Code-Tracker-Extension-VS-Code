import * as vscode from 'vscode';
import { SECRET_KEY_ID } from './constants';
import { getStoredClientKey } from './keyStore';
import { fetchTrackedFiles, TrackedFile } from './trackerApi';

function getSettingsHtml(): string {
	const nonce = Date.now().toString();

	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Code Tracker Settings</title>
    <style>
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
          sans-serif;
        padding: 16px;
        color: var(--vscode-foreground);
        background-color: var(--vscode-editor-background);
      }
      h1 {
        font-size: 1.3rem;
        margin-bottom: 4px;
      }
      p.description {
        font-size: 0.9rem;
        color: var(--vscode-descriptionForeground);
        margin-bottom: 16px;
      }
      .tabs {
        display: flex;
        gap: 4px;
        margin-bottom: 12px;
        border-bottom: 1px solid var(--vscode-editorGroup-border);
      }
      .tab {
        padding: 6px 12px;
        cursor: pointer;
        border: none;
        background: transparent;
        color: var(--vscode-foreground);
        border-bottom: 2px solid transparent;
        font-size: 0.9rem;
      }
      .tab.active {
        border-bottom-color: var(--vscode-button-background);
        font-weight: 600;
      }
      .tab-content {
        display: none;
      }
      .tab-content.active {
        display: block;
      }
      .field-label {
        font-size: 0.85rem;
        margin-bottom: 4px;
      }
      input[type="password"],
      input[type="text"] {
        width: 100%;
        padding: 6px 8px;
        border-radius: 4px;
        border: 1px solid var(--vscode-input-border, transparent);
        color: var(--vscode-input-foreground);
        background-color: var(--vscode-input-background);
        box-sizing: border-box;
        margin-bottom: 8px;
      }
      button {
        padding: 6px 12px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        background-color: var(--vscode-button-background);
        color: var(--vscode-button-foreground);
      }
      button:hover {
        background-color: var(--vscode-button-hoverBackground);
      }
      .status {
        margin-top: 6px;
        font-size: 0.8rem;
        color: var(--vscode-descriptionForeground);
      }
      .badge {
        display: inline-block;
        padding: 2px 6px;
        border-radius: 999px;
        font-size: 0.75rem;
        margin-left: 4px;
      }
      .badge-ok {
        background-color: #2e7d32;
        color: #ffffff;
      }
      .badge-missing {
        background-color: #c62828;
        color: #ffffff;
      }
      .files-list {
        margin-top: 8px;
        max-height: 260px;
        overflow-y: auto;
        border: 1px solid var(--vscode-editorGroup-border);
        border-radius: 4px;
      }
      .file-item {
        padding: 6px 8px;
        border-bottom: 1px solid var(--vscode-editorGroup-border);
        font-size: 0.8rem;
      }
      .file-item:last-child {
        border-bottom: none;
      }
      .file-name {
        font-weight: 600;
      }
      .file-meta {
        color: var(--vscode-descriptionForeground);
      }
      .file-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 8px;
      }
      .file-actions {
        flex-shrink: 0;
      }
      .icon-button {
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 1rem;
        padding: 2px 4px;
        color: var(--vscode-foreground);
      }
      .icon-button:hover {
        background-color: var(--vscode-list-hoverBackground);
      }
    </style>
  </head>
  <body>
    <h1>Code Tracker Settings</h1>
    <p class="description">
      Manage the client key used to authorize sending notebook states to your API,
      and inspect saved files.
    </p>

    <div class="tabs">
      <button id="tab-key" class="tab active">Client key</button>
      <button id="tab-activity" class="tab">Saved files</button>
    </div>

    <div id="tab-content-key" class="tab-content active">
      <div class="field-label">
        Client key
        <span id="key-status" class="badge badge-missing">No key stored</span>
      </div>
      <input id="key-input" type="password" placeholder="Paste your client key" />
      <div
        style="
          margin-bottom: 8px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 12px;
        "
      >
        <label>
          <input id="toggle-visibility" type="checkbox" />
          Show key
        </label>
        <button
          id="delete-btn"
          style="
            background-color: var(--vscode-errorForeground);
            color: #ffffff;
            padding: 3px 8px;
            font-size: 0.75rem;
          "
        >
          Delete key
        </button>
      </div>
      <button id="save-btn">Save key</button>
      <div class="status" id="status-text"></div>
    </div>

    <div id="tab-content-activity" class="tab-content">
      <div class="field-label">Saved notebook files</div>
      <button id="refresh-files-btn">Refresh list</button>
      <div class="status" id="files-status"></div>
      <div id="files-list" class="files-list"></div>
    </div>

    <script nonce="${nonce}">
      const vscode = acquireVsCodeApi();

      const tabKey = document.getElementById('tab-key');
      const tabActivity = document.getElementById('tab-activity');
      const tabContentKey = document.getElementById('tab-content-key');
      const tabContentActivity = document.getElementById('tab-content-activity');

      const keyInput = document.getElementById('key-input');
      const saveBtn = document.getElementById('save-btn');
      const deleteBtn = document.getElementById('delete-btn');
      const statusText = document.getElementById('status-text');
      const keyStatus = document.getElementById('key-status');
      const toggleVisibility = document.getElementById('toggle-visibility');
      const refreshFilesBtn = document.getElementById('refresh-files-btn');
      const filesStatus = document.getElementById('files-status');
      const filesList = document.getElementById('files-list');

      function activateTab(tab) {
        if (tab === 'key') {
          tabKey.classList.add('active');
          tabActivity.classList.remove('active');
          tabContentKey.classList.add('active');
          tabContentActivity.classList.remove('active');
        } else {
          tabKey.classList.remove('active');
          tabActivity.classList.add('active');
          tabContentKey.classList.remove('active');
          tabContentActivity.classList.add('active');
        }
      }

      tabKey.addEventListener('click', () => activateTab('key'));
      tabActivity.addEventListener('click', () => activateTab('activity'));

      window.addEventListener('message', (event) => {
        const msg = event.data;
        if (msg.type === 'init') {
          if (typeof msg.key === 'string') {
            keyInput.value = msg.key;
          }
          if (msg.hasKey) {
            keyStatus.textContent = 'Key stored';
            keyStatus.classList.remove('badge-missing');
            keyStatus.classList.add('badge-ok');
            statusText.textContent = '';
          } else {
            keyStatus.textContent = 'No key stored';
            keyStatus.classList.remove('badge-ok');
            keyStatus.classList.add('badge-missing');
            statusText.textContent = 'Enter and save a client key to enable tracking.';
          }
        } else if (msg.type === 'saved') {
          statusText.textContent = 'Key saved successfully.';
          keyStatus.textContent = 'Key stored';
          keyStatus.classList.remove('badge-missing');
          keyStatus.classList.add('badge-ok');
        } else if (msg.type === 'deleted') {
          keyInput.value = '';
          statusText.textContent = 'Key deleted.';
          keyStatus.textContent = 'No key stored';
          keyStatus.classList.remove('badge-ok');
          keyStatus.classList.add('badge-missing');
        } else if (msg.type === 'files') {
          const data = msg.data;
          filesStatus.textContent = '';
          filesList.innerHTML = '';

          const items = Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
            ? data
            : [];

          if (!items.length) {
            filesStatus.textContent = 'No files found.';
            return;
          }

          for (const item of items) {
            const div = document.createElement('div');
            div.className = 'file-item';
            const row = document.createElement('div');
            row.className = 'file-row';

            const info = document.createElement('div');
            const name = document.createElement('div');
            name.className = 'file-name';
            name.textContent = item.fileName || '(no name)';
            const meta = document.createElement('div');
            meta.className = 'file-meta';
            meta.textContent =
              (item.filePath || '') + '  —  ' + (item.timestamp || '');
            info.appendChild(name);
            info.appendChild(meta);

            const actions = document.createElement('div');
            actions.className = 'file-actions';
            const copyBtn = document.createElement('button');
            copyBtn.className = 'icon-button';
            copyBtn.title = 'Copy full content to clipboard';
            copyBtn.textContent = '📋';
            copyBtn.addEventListener('click', () => {
              vscode.postMessage({
                type: 'copyContent',
                content: item.fullContent || ''
              });
            });
            actions.appendChild(copyBtn);

            row.appendChild(info);
            row.appendChild(actions);
            div.appendChild(row);
            filesList.appendChild(div);
          }
        } else if (msg.type === 'filesError') {
          filesList.innerHTML = '';
          filesStatus.textContent = msg.message || 'Failed to load files.';
        } else if (msg.type === 'error') {
          statusText.textContent = msg.message || 'Failed to save key.';
        }
      });

      saveBtn.addEventListener('click', () => {
        const value = keyInput.value.trim();
        vscode.postMessage({ type: 'saveKey', value });
      });

      deleteBtn.addEventListener('click', () => {
        vscode.postMessage({ type: 'deleteKey' });
      });

      refreshFilesBtn.addEventListener('click', () => {
        filesStatus.textContent = 'Loading...';
        filesList.innerHTML = '';
        vscode.postMessage({ type: 'getFiles' });
      });

      toggleVisibility.addEventListener('change', () => {
        if (toggleVisibility.checked) {
          keyInput.type = 'text';
        } else {
          keyInput.type = 'password';
        }
      });
    </script>
  </body>
</html>`;
}

export function registerSettingsPanel(
	context: vscode.ExtensionContext
): vscode.Disposable {
	return vscode.commands.registerCommand(
		'code-tracker.openSettings',
		async () => {
			const panel = vscode.window.createWebviewPanel(
				'codeTrackerSettings',
				'Code Tracker Settings',
				vscode.ViewColumn.One,
				{
					enableScripts: true
				}
			);

			panel.webview.html = getSettingsHtml();

			const currentKey = await getStoredClientKey(context);
			const hasKey = !!currentKey;
			void panel.webview.postMessage({
				type: 'init',
				hasKey,
				key: currentKey ?? ''
			});

			panel.webview.onDidReceiveMessage(
				async (message) => {
					if (message.type === 'saveKey') {
						const value = (message.value as string | undefined) ?? '';
						if (!value) {
							void panel.webview.postMessage({
								type: 'error',
								message: 'Key cannot be empty.'
							});
							return;
						}

						await context.secrets.store(SECRET_KEY_ID, value);
						void panel.webview.postMessage({ type: 'saved' });
						void vscode.window.showInformationMessage(
							'Code Tracker: client key saved.'
						);
					} else if (message.type === 'deleteKey') {
						await context.secrets.delete(SECRET_KEY_ID);
						void panel.webview.postMessage({ type: 'deleted' });
						void vscode.window.showInformationMessage(
							'Code Tracker: client key deleted.'
						);
					} else if (message.type === 'getFiles') {
						try {
							const data = await fetchTrackedFiles(context);
							void panel.webview.postMessage({ type: 'files', data });
						} catch (error: any) {
							void panel.webview.postMessage({
								type: 'filesError',
								message: error?.message ?? 'Failed to load files.'
							});
						}
					} else if (message.type === 'copyContent') {
						const value = (message.content as string | undefined) ?? '';
						if (!value) {
							void vscode.window.showWarningMessage(
								'Code Tracker: nothing to copy.'
							);
							return;
						}

						await vscode.env.clipboard.writeText(value);
						void vscode.window.showInformationMessage(
							'Code Tracker: file content copied to clipboard.'
						);
					}
				},
				undefined,
				context.subscriptions
			);
		}
	);
}


