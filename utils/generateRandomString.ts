export const generateRandomString = (): string => {
  const randomize = () => Math.random()
    .toString(36)
    .substring(2);

  return randomize() + randomize();
};
