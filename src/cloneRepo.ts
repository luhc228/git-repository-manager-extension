import * as vscode from 'vscode';
import * as path from 'path';
// @ts-expect-error loss ts type
import giturl from 'giturl';
import { execa } from 'execa';
import { CommandId as ShowCloneRepoProgressCommandId } from '@/commands/showCloneRepoProgress';

export function cloneRepo(gitUrl: string) {
  const url = giturl.parse(gitUrl) as string;
  const localPath = path.join(
    '/Users/luhc228/Code', // TODO:
    url.replace(/^https?:\/\//, ''),
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
