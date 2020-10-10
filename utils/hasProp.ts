const hasOwnProperty = (obj: any, type: string) => {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, type);
};

export const hasProp = (obj: any, type: string | string[]): boolean => {
  const isMultipleTypes: boolean = typeof type !== 'string';

  return isMultipleTypes
    ? (type as string[]).every((ele) => hasOwnProperty(obj, ele))
    : hasOwnProperty(obj, type as string);
};
