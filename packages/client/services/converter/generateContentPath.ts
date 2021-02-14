import { RawLocation } from 'vue-router';
import type { App } from '~/entities';

export const generateContentPath = (
  type: App.ContentItemType,
  id: string,
  trackId?: string,
): RawLocation => {
  const linkType = {
    album: 'releases',
    artist: 'artists',
    track: 'releases',
    playlist: 'playlists',
    show: 'shows',
    episode: 'episodes',
  }[type];

  return type === 'track'
    ? {
      path: `/${linkType}/${id}`,
      query: { track: trackId },
    }
    : `/${linkType}/${id}`;
};
