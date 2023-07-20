import * as vscode from 'vscode';
import { registryShowGitRepoInput } from './showGitRepoInput';
import { registryShowCloneRepoProgress } from './showCloneRepoProgress';

export function registerCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    registryShowGitRepoInput(),
    registryShowCloneRepoProgress(),
  );
}
