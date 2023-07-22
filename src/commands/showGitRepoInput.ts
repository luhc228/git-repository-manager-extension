import cloneRepo from '@/cloneRepo';
import * as vscode from 'vscode';

export const CommandId = 'showGitRepoInputBox';

export function registryShowGitRepoInput() {
  return vscode.commands.registerCommand(
    CommandId,
    async () => {
      const gitRepoUrl = await vscode.window.showInputBox({
        placeHolder: 'Input your git repository url. e.g: git@github.com:a/b.git',
        validateInput: (value) => {
          if (/((git|ssh|http(s)?)|(git@[\w.-]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)$/.test(value)) {
            return null;
          }
          return 'Git repository url is invalid. Please check it again.';
        },
      });

      if (!gitRepoUrl) {
        return;
      }

      cloneRepo(gitRepoUrl);
    },
  );
}
