import * as os from 'os';
import * as vscode from 'vscode';
import fse from 'fs-extra';

const BaseDirPropertyName = 'git-repository-manager.baseDir';

export default async function getRepoBaseDir() {
  let baseDir = vscode.workspace
    .getConfiguration()
    .get(BaseDirPropertyName) as string;
  if (!baseDir) {
    throw new Error(`Your configure property ${BaseDirPropertyName} is invalid. Extension expects non-empty string.`);
  }

  const userHomeDir = os.homedir();
  baseDir = baseDir.replace(/^~/, userHomeDir);

  await fse.ensureDir(baseDir);

  return baseDir;
}
