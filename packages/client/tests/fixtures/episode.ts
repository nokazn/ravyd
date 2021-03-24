import type { SpotifyAPI } from 'shared/types';
import { externalUrls, image, resumePoint } from './spotify';
import { simpleShow } from './show';

interface Params {
  explicit?: boolean;
  is_playable?: boolean;
  fully_played?: boolean;
  resume_point?: number;
}

export const simpleEpisode = (i: number, params?: Params): SpotifyAPI.SimpleEpisode => {
  const duration_ms = 30 * 60 * 1000;
  const fully_played = params?.fully_played ?? false;
  return {
    audio_preview_url: 'audio/preview/url',
    description: `description${i}`,
    duration_ms,
    explicit: params?.explicit ?? false,
    external_urls: externalUrls(i),
    href: `path/to/episode${i}`,
    id: `episode${i}`,
    images: [image(i)],
    is_externally_hosted: false,
    is_playable: params?.explicit ?? true,
    language: 'JP',
    languages: ['JP'],
    name: `name${i}`,
    release_date: '2021-03-22',
    release_date_precision: 'day',
    resume_point: resumePoint(fully_played, fully_played
      ? duration_ms
      : duration_ms / 2),
    type: 'episode',
    uri: `uri${i}`,
  };
};

export const episode = (i: number, params?: Params): SpotifyAPI.Episode => ({
  ...simpleEpisode(i, params),
  show: simpleShow(i),
});
