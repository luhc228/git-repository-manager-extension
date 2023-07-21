import * as vscode from 'vscode';
import { registerCommands } from '@/commands';
import { RepoExplorerProvider } from '@/views/RepoExplorerProvider';
import findAllRepoPaths from '@/utils/findAllRepoPaths';

export async function activate(context: vscode.ExtensionContext) {
  vscode.commands.executeCommand('setContext', 'isInWorkspace', !vscode.workspace.workspaceFolders);

  const repoExplorerProvider = new RepoExplorerProvider();
  context.subscriptions.push(
    vscode.window.createTreeView('repoExplorer', { treeDataProvider: repoExplorerProvider }),
  );

  registerCommands(context, repoExplorerProvider);

  findAllRepoPaths();
}

export async function deactivate() { }
