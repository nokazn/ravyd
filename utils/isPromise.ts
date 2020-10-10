export const isPromise = (fn: (...args: any[]) => unknown): boolean => {
  // [object AsyncFunction] のようになっている部分から AsyncFunction を取り出す
  const type = Object.prototype.toString.call(fn).slice(8, -1);
  return type === 'AsyncFunction' || type === 'Promise';
};
