import globalConfig from './globalConfig';

const key = 'allLocalRepoPaths';

export function getRepoPaths() {
  return globalConfig.get(key);
}

export function setRepoPaths(repoPaths: string[]) {
  globalConfig.set(key, repoPaths);
}
