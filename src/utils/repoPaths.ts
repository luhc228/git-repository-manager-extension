import globalConfig from './globalConfig';

const key = 'allLocalRepoPaths';

export function getRepoPaths() {
  return globalConfig.get(key) as string[] | undefined;
}

export function setRepoPaths(repoPaths: string[]): void {
  globalConfig.set(key, repoPaths);
}
