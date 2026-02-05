import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient/node';

let client: LanguageClient | undefined;

function getServerPath(context: vscode.ExtensionContext): string {
  const platform = process.platform;
  let binaryName: string;

  switch (platform) {
    case 'win32':
      binaryName = 'djch-win.exe';
      break;
    case 'darwin':
      binaryName = 'djch-darwin';
      break;
    case 'linux':
      binaryName = 'djch-linux';
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  const serverPath = context.asAbsolutePath(path.join('bin', binaryName));

  if (!fs.existsSync(serverPath)) {
    throw new Error(`Server binary not found at ${serverPath}`);
  }

  // Ensure executable on Unix
  if (platform !== 'win32') {
    fs.chmodSync(serverPath, 0o755);
  }

  return serverPath;
}

export async function activate(context: vscode.ExtensionContext) {
  let serverCommand: string;

  try {
    serverCommand = getServerPath(context);
  } catch (error) {
    vscode.window.showErrorMessage(
      `Django-Check LSP: ${error instanceof Error ? error.message : 'Failed to locate server binary'}`
    );
    return;
  }

  const serverOptions: ServerOptions = {
    command: serverCommand,
    args: ['server'],
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'python' }],
    synchronize: {
      configurationSection: ['python'],
    },
  };

  client = new LanguageClient('djch', 'Django-Check LS', serverOptions, clientOptions);
  context.subscriptions.push(client);

  await client.start();
}

export function deactivate(): Promise<void> | undefined {
  return client?.stop();
}