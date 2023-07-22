import * as path from 'path';
import fse from 'fs-extra';
import { isGitRepo } from './git';
import getRepoBaseDir from './getRepoBaseDir';

export default async function findAllRepoPaths() {
  const set = new Set<string>();

  async function findRepoPath(parentPath?: string) {
    if (!parentPath || !(fse.pathExistsSync(parentPath))) {
      return;
    }

    if (isGitRepo(parentPath)) {
      set.add(parentPath);
      return;
    }

    const childDirNames = fse.readdirSync(parentPath);
    childDirNames.forEach((childDirName) => {
      findRepoPath(path.join(parentPath, childDirName));
    });
  }

  const repoBaseDir = await getRepoBaseDir();
  await findRepoPath(repoBaseDir);

  return Array.from(set);
}
