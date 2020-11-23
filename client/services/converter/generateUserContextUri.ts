export const generateUserContextUri = (userId: string | undefined, type: 'collection' | 'history') => {
  return userId != null
    ? `spotify:user:${userId}:${type}`
    : undefined;
};
