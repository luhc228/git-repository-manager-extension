import * as vscode from 'vscode';
import fse from 'fs-extra';
import * as path from 'path';
import getRepoBaseDir from '@/utils/getRepoBaseDir';
import { isGitRepo } from '@/utils/git';
import findAllRepoPaths from '@/utils/findAllRepoPaths';

export class RepoExplorerProvider implements vscode.TreeDataProvider<RepoFolder>, vscode.Disposable {
  private _onDidChangeTreeData: vscode.EventEmitter<RepoFolder | undefined | void> =
    new vscode.EventEmitter<RepoFolder | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<RepoFolder | undefined | void> = this._onDidChangeTreeData.event;
  private _disposables: vscode.Disposable[] = [];

  constructor() {
    this._disposables.push(
      vscode.commands.registerCommand('repoExplorer.refresh', () => {
        this.refresh();
      }),
      vscode.commands.registerCommand('repoExplorer.openRepo', (repoFolder: RepoFolder) => {
        vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(repoFolder.path), !!vscode.workspace.workspaceFolders);
      }),
      vscode.commands.registerCommand(
        'repoExplorer.search',
        async () => {
          const repoBaseDir = await getRepoBaseDir();
          const allRepoPaths = await findAllRepoPaths();
          const repoGroupNameSet = new Set<string>();
          allRepoPaths.forEach((repoPath) => {
            // remove base dir from repo path
            const gitUrl = repoPath.replace(new RegExp(`^${repoBaseDir}`), '');
            // For example: github.com/gitlab
            const repoGroupName = gitUrl.split(path.sep)[gitUrl.startsWith(path.sep) ? 1 : 0];
            repoGroupNameSet.add(repoGroupName);
          });

          const quickPickItems: vscode.QuickPickItem[] = [];
          repoGroupNameSet.forEach((repoGroupName) => {
            quickPickItems.push({ label: repoGroupName, kind: vscode.QuickPickItemKind.Separator });
            const repoPaths = allRepoPaths.filter(repoPath => {
              return repoPath.startsWith(path.join(repoBaseDir, repoGroupName, path.sep));
            });
            repoPaths.forEach(repoPath => {
              quickPickItems.push({
                label: path.basename(repoPath),
                description: repoPath,
              });
            });
          });

          const result = await vscode.window.showQuickPick(
            quickPickItems,
            {
              placeHolder: 'Input your git repository name to filter.',
              title: 'Select one of your git repositories to open.',
            },
          );

          if (!result) {
            return;
          }

          vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(result.description!), !!vscode.workspace.workspaceFolders);
        },
      ),
    );
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: RepoFolder): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: RepoFolder): Promise<RepoFolder[]> {
    if (element) {
      const { path: folderPath } = element;
      return this.getGitRepo(folderPath);
    } else {
      const repoBaseDir = await getRepoBaseDir();
      if (!repoBaseDir) {
        return Promise.resolve([]);
      }
      return this.getGitRepo(repoBaseDir);
    }
  }

  private async getGitRepo(parentPath: string) {
    const dirs = await fse.readdir(parentPath);
    const repoFolders: RepoFolder[] = [];
    for (const dir of dirs) {
      const childPath = path.join(parentPath, dir);
      repoFolders.push(new RepoFolder(
        dir,
        isGitRepo(childPath) ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed,
        childPath,
      ));
    }
    return repoFolders;
  }

  dispose() {
    this._disposables.forEach(dispose => dispose.dispose());
    this._disposables = [];
  }
}

class RepoFolder extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly path: string,
  ) {
    super(label, collapsibleState);
  }

  command = this.collapsibleState === vscode.TreeItemCollapsibleState.None
    ? { command: 'repoExplorer.openRepo', title: 'Open Repository', arguments: [this] }
    : undefined;

  iconPath = new vscode.ThemeIcon(this.collapsibleState === vscode.TreeItemCollapsibleState.None ? 'git-branch' : 'symbol-folder');

  contextValue = this.collapsibleState === vscode.TreeItemCollapsibleState.None ? 'repoFolder' : 'folder';
}
