import { App } from '~~/types';

export const generateContentPath = (type: App.ContentItemType, id: string) => {
  const linkType = {
    album: 'releases',
    artist: 'artists',
    track: 'releases',
    playlist: 'playlists',
    show: 'shows',
    episode: 'episodes',
  }[type];

  return `/${linkType}/${id}`;
};
