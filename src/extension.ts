import * as vscode from 'vscode';
import { registerCommands } from '@/commands';

export async function activate(context: vscode.ExtensionContext) {
  vscode.commands.executeCommand('setContext', 'isInWorkspace', !vscode.workspace.workspaceFolders);

  registerCommands(context);
}

export async function deactivate() { }
