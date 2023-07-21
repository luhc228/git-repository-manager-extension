import cloneRepo from '@/cloneRepo';
import * as vscode from 'vscode';

export const CommandId = 'git-repository-manager.showGitRepoInputBox';

export function registryShowGitRepoInput() {
  return vscode.commands.registerCommand(
    CommandId,
    async () => {
      const gitRepoUrl = await vscode.window.showInputBox({
        title: '',
        validateInput: (value) => {
          console.log('gitRepo: ', value);
          // TODO: validate git repo
          return null;
        },
      });

      if (!gitRepoUrl) {
        return;
      }

      cloneRepo(gitRepoUrl);
    },
  );
}
