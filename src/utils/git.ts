import simpleGit from 'simple-git';

export async function isGitRepo(path: string) {
  try {
    return simpleGit(path).checkIsRepo();
  } catch (error) {
    return false;
  }
}
