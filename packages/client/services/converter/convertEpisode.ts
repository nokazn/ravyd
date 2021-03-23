import type { SpotifyAPI } from 'shared/types';
import type { App } from '~/entities';

type Episode = SpotifyAPI.Episode | SpotifyAPI.SimpleEpisode;
interface CommonConvertEpisodeDetailParams {
  offset?: number;
}
// Episode の場合は show の情報は不要
type ConvertEpisodeDetailParams<T> = T extends SpotifyAPI.Episode
  ? CommonConvertEpisodeDetailParams | undefined
  : CommonConvertEpisodeDetailParams & {
    showId: string;
    showName: string;
  }

const hasEpisodeAttributes = (
  params: ConvertEpisodeDetailParams<Episode>,
): params is ConvertEpisodeDetailParams<SpotifyAPI.SimpleShow> => {
  return params != null && 'showId' in params;
};

export const convertEpisodeDetail = <T extends Episode = SpotifyAPI.Episode>(params: ConvertEpisodeDetailParams<T>) => (
  episode: T,
  index: number,
): App.EpisodeDetail => {
  const common = {
    index: index + (params?.offset ?? 0),
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
  };
  if (hasEpisodeAttributes(params)) {
    return {
      ...common,
      showId: params.showId,
      showName: params.showName,
    };
  }
  const { show } = episode as SpotifyAPI.Episode;
  return {
    ...common,
    showId: show.id,
    showName: show.name,
  };
};
