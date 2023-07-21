import * as vscode from 'vscode';
import { registerCommands } from '@/commands';
import createTreeViews from './views';

export async function activate(context: vscode.ExtensionContext) {
  vscode.commands.executeCommand('setContext', 'isInWorkspace', !vscode.workspace.workspaceFolders);

  registerCommands(context);

  createTreeViews(context);
}

export async function deactivate() { }
