import * as path from 'path';
import fse from 'fs-extra';
import { isGitRepo } from './git';
import getRepoBaseDir from './getRepoBaseDir';
import { setRepoPaths } from './repoPaths';

export default async function findAllRepoPaths() {
  const set = new Set();

  async function findRepoPath(parentPath?: string) {
    if (!parentPath || !(await fse.pathExists(parentPath))) {
      return;
    }
    if (await isGitRepo(parentPath)) {
      set.add(parentPath);
      setRepoPaths(Array.from(set) as string[]);
      return;
    }

    const childDirNames = await fse.readdir(parentPath);
    childDirNames.forEach((childDirName) => {
      findRepoPath(path.join(parentPath, childDirName));
    });
  }

  const repoBaseDir = await getRepoBaseDir();

  findRepoPath(repoBaseDir);
}
