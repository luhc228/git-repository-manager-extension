import * as vscode from 'vscode';
import * as path from 'path';
// @ts-expect-error loss ts type
import giturl from 'giturl';
import { execa } from 'execa';
import { CommandId as ShowCloneRepoProgressCommandId } from '@/commands/showCloneRepoProgress';
import getRepoBaseDir from '@/utils/getRepoBaseDir';

const RepoDirsMapPropertyName = 'git-repository-manager.reposDirMap';

export default async function cloneRepo(gitUrl: string) {
  const url = giturl.parse(gitUrl) as string;

  const repoBaseDir = await getRepoBaseDir();
  if (!repoBaseDir) {
    return;
  }
  const repoDirsMap = vscode.workspace
    .getConfiguration()
    .get(RepoDirsMapPropertyName) as Record<string, string>;
  let gitRepoPath = url
    .replace(/^https?:\/\//, '');
  const matchedResult = gitRepoPath.match(/^([^/]+)/);
  if (!matchedResult || !matchedResult[1]) {
    console.error(`Can't match the domain name from ${gitRepoPath}.`);
    return;
  }
  gitRepoPath = gitRepoPath.replace(/^([^/]+)/, repoDirsMap[matchedResult[1]] || '');
  const localPath = path.join(
    repoBaseDir,
    gitRepoPath,
  );

  const abortController = new AbortController();
  const gitCloneSubprocess = execa('git', ['clone', gitUrl, localPath], { signal: abortController.signal });

  vscode.commands.executeCommand(
    ShowCloneRepoProgressCommandId,
    gitCloneSubprocess,
    abortController,
    gitUrl,
    localPath,
  );
}
