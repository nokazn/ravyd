import type { SpotifyAPI } from 'shared/types';
import type { App } from '~/entities';

type Episode = SpotifyAPI.Episode | SpotifyAPI.SimpleEpisode;
// Episode の場合は show の情報は不要
type ConvertEpisodeDetailParams<T> = T extends SpotifyAPI.Episode
  ? {
    offset?: number;
    showId?: undefined;
    showName?: undefined;
  } | undefined
  : {
    offset?: number;
    showId: string;
    showName: string;
  }

export const convertEpisodeDetail = <T extends Episode>(params: ConvertEpisodeDetailParams<T>) => (
  episode: SpotifyAPI.SimpleEpisode,
  index: number,
): App.EpisodeDetail => {
  const offset = params?.offset ?? 0;
  const showId = params?.showId;
  const showName = params?.showName;
  const detail = {
    index: index + offset,
    id: episode.id,
    name: episode.name,
    uri: episode.uri,
    description: episode.description,
    images: episode.images,
    isPlayable: episode.is_playable,
    explicit: episode.explicit,
    releaseDate: episode.release_date,
    releaseDatePrecision: episode.release_date_precision,
    durationMs: episode.duration_ms,
    resumePoint: episode.resume_point,
    externalUrls: episode.external_urls,
    previewUrl: episode.audio_preview_url,
    showId: showId ?? (episode as SpotifyAPI.Episode).show.id,
    showName: showName ?? (episode as SpotifyAPI.Episode).show.name,
  };
  return detail;
};
