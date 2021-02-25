import * as path from 'path';

const generateRelativePath = (r: string) => (p?: string) => {
  return path.join(__dirname, r, p ?? '');
};

export const projectRoot = generateRelativePath('../../../');
export const clientRoot = generateRelativePath('../');
