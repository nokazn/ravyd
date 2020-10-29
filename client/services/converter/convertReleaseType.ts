import { SpotifyAPI, App } from '~~/types';

export const convertReleaseType = (
  releaseType: SpotifyAPI.Album['album_type'],
  totalTracks: number,
): App.ReleasePage['releaseType'] => {
  const albumTypeMap = {
    album: 'アルバム',
    // 4曲以上収録の場合は EP と表記
    single: totalTracks > 3 ? 'EP' : 'シングル',
    compilation: 'コンピレーション',
  } as const;

  return albumTypeMap[releaseType];
};
