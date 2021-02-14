import { addComma } from 'shared/utils';

export const getFollowersText = (followers: number | null): string | undefined => {
  return followers != null
    ? `フォロワー ${addComma(followers)}人`
    : undefined;
};
