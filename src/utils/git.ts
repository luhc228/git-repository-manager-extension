import * as path from 'path';
import fse from 'fs-extra';

export function isGitRepo(dir: string) {
  return fse.pathExistsSync(path.join(dir, '.git'));
}
