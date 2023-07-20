import type { ExecaChildProcess } from 'execa';
import * as vscode from 'vscode';

export const CommandId = 'git-repository-manager.showCloneRepoProgress';

export function registryShowCloneRepoProgress() {
  return vscode.commands.registerCommand(
    CommandId,
    (
      gitCloneSubprocess: ExecaChildProcess<string>,
      abortController: AbortController,
      gitRepoUrl: string,
      localRepoPath: string,
    ) => {
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Start cloning repository ${gitRepoUrl} into ${localRepoPath}.`,
        cancellable: true,
      }, async (__, token) => {
        token.onCancellationRequested(() => {
          abortController.abort();
        });

        return gitCloneSubprocess;
      }).then(
        () => {
          vscode.window.showInformationMessage(`Clone ${gitRepoUrl} to ${localRepoPath} Successfully!`);
        },
        (error: any) => {
          vscode.window.showErrorMessage(`Clone ${gitRepoUrl} error: `, error);
        },
      );
    });
}
