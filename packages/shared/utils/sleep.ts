export const sleep = (millSeconds: number) => new Promise(
  (resolve) => setTimeout(resolve, millSeconds),
);
