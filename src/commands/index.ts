import * as vscode from 'vscode';
import { registryShowGitRepoInput } from './showGitRepoInput';
import { registryShowCloneRepoProgress } from './showCloneRepoProgress';
import type { RepoExplorerProvider } from '@/views/RepoExplorerProvider';

export function registerCommands(context: vscode.ExtensionContext, repoExplorerProvider: RepoExplorerProvider) {
  context.subscriptions.push(
    registryShowGitRepoInput(),
    registryShowCloneRepoProgress(repoExplorerProvider),
  );
}
