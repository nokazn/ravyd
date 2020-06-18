import { SpotifyAPI, App } from '~~/types';

export const convertReleaseType = (
  releaseType: SpotifyAPI.Album['album_type'],
): App.ReleaseInfo['releaseType'] => {
  const albumTypeMap = {
    album: 'アルバム' as const,
    single: 'シングル' as const,
    compilation: 'コンピレーション' as const,
  } as const;

  return albumTypeMap[releaseType];
};
