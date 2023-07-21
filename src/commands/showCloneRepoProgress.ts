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
          const confirmText = 'Yes';
          vscode.window.showInformationMessage(
            `Clone repository to ${localRepoPath} Successfully! Do you want open it?`,
            confirmText,
          ).then(res => {
            if (res === confirmText) {
              vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(localRepoPath), !!vscode.workspace.workspaceFolders);
            }
          });
        },
        (error: any) => {
          if (gitCloneSubprocess.killed || error.isCanceled) {
            vscode.window.showInformationMessage(`Cancel clone git repository ${gitRepoUrl}.`);
            return;
          }
          vscode.window.showErrorMessage(`Clone ${gitRepoUrl} error: ${error.stderr}`);
        },
      );
    });
}
