import { Context } from '@nuxt/types';
import { parseAlbumType } from '~/scripts/parser/parseAlbumType';
import { getImageSrc } from '~/scripts/parser/getImageSrc';
import { SpotifyAPI } from '~~/types';

export type ReleaseInfo = {
  albumType: 'アルバム' | 'シングル' | 'コンピレーション'
  artistList: {
    name: string
    id: string
  }[]
  label: string
  name: string
  id: string
  uri: string
  releaseDate: string
  releaseDatePrecision: string
  artwork: {
    src: string
    alt: string
    size: 220
  }
  trackList: SpotifyAPI.SimpleTrack[]
  isTrackSavedList: boolean[]
  totalTracks: number
  durationMs: number
  copyrightList: SpotifyAPI.Copyright[]
  isSaved: boolean
}

export const getReleaseInfo = async ({ app, params }: Context): Promise<ReleaseInfo | null> => {
  const release = await app.$spotify.albums.getAlbum({ albumId: params.releaseId });
  if (release == null) return null;

  const {
    album_type,
    artists,
    label,
    name,
    id,
    uri,
    release_date: releaseDate,
    release_date_precision: releaseDatePrecision,
    tracks: {
      items: trackList,
    },
    total_tracks: totalTracks,
    images,
    copyrights: copyrightList,
  } = release;

  const albumType = parseAlbumType(album_type);

  const artistList = artists.map((artist) => ({
    id: artist.id,
    name: artist.name,
  }));

  const artworkSize = 220 as const;
  const artwork = {
    size: artworkSize,
    src: getImageSrc(images, artworkSize),
    alt: `the artwork of ${name} by ${artistList.map((artist) => artist.name).join(', ')}`,
  };

  const trackIdList = trackList.map((track) => track.id);
  const albumIdList = [id];
  const [isTrackSavedList, [isSaved]] = await Promise.all([
    // @todo 50 トラック超えた時
    app.$spotify.library.checkUserSavedTracks({ trackIdList }),
    app.$spotify.library.checkUserSavedAlbums({ albumIdList }),
  ] as const);

  const durationMs = trackList.reduce((prev, track) => track.duration_ms + prev, 0);

  return {
    albumType,
    artistList,
    label,
    name,
    id,
    uri,
    releaseDate,
    releaseDatePrecision,
    artwork,
    trackList,
    isTrackSavedList,
    totalTracks,
    durationMs,
    copyrightList,
    isSaved,
  };
};
