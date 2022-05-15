export const sleep = (millSeconds: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, millSeconds);
  });
};
