import { SpotifyAPI } from '~~/types';

export type AlbumType = 'アルバム' | 'シングル' | 'コンピレーション'

export const parseAlbumType = (albumType: SpotifyAPI.Album['album_type']): AlbumType => {
  const albumTypeMap = {
    album: 'アルバム' as const,
    single: 'シングル' as const,
    compilation: 'コンピレーション' as const,
  } as const;

  return albumTypeMap[albumType];
};
