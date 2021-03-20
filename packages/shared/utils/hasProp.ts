const hasOwnProperty = <T extends string>(obj: unknown, type: T): obj is Record<T, unknown> => {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, type);
};

export const hasProp = <T extends string>(obj: unknown, type: T | T[]): obj is Record<T, unknown> => {
  return typeof type !== 'string'
    ? type.every((ele) => hasOwnProperty(obj, ele))
    : hasOwnProperty(obj, type);
};
