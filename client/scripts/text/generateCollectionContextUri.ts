export const generateCollectionContextUri = (userId: string) => {
  const uri = `spotify:user:${userId}:collection`;
  return uri;
};
