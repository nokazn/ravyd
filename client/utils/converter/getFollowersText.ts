import { addComma } from '~~/utils/addComma';

export const getFollowersText = (
  followers: number | null,
): string | undefined => (followers != null
  ? `フォロワー ${addComma(followers)}人`
  : undefined);
