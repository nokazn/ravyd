import {
  simpleAlbum,
  track,
  artist,
  simplePlaylist,
  simpleEpisode,
  simpleShow,
} from '~/tests/fixtures';
import { convertToContentListItem } from './convertItem';

describe('converter/convertToContentListItem', () => {
  it('convert SimpleAlbum to ContentListItem', () => {
    const item = simpleAlbum(3);
    expect(convertToContentListItem('album')(item)).toEqual({
      type: 'album',
      id: item.id,
      name: item.name,
      uri: item.uri,
      externalUrls: item.external_urls,
      releaseId: item.id,
      images: item.images,
      artists: item.artists,
      to: `/releases/${item.id}`,
    });
  });

  it('convert SimpleTrack to ContentListItem', () => {
    const item = track(3);
    expect(convertToContentListItem('track')(item)).toEqual({
      type: 'track',
      id: item.id,
      name: item.name,
      uri: item.uri,
      externalUrls: item.external_urls,
      releaseId: item.album.id,
      images: item.album.images,
      artists: item.album.artists,
      to: {
        path: `/releases/${item.album.id}`,
        query: { track: item.id },
      },
      linkedFrom: item.linked_from,
    });
  });

  it('convert SimpleEpisode to ContentListItem', () => {
    const item = artist(3);
    expect(convertToContentListItem('artist')(item)).toEqual({
      type: 'artist',
      id: item.id,
      name: item.name,
      uri: item.uri,
      externalUrls: item.external_urls,
      releaseId: item.id,
      images: item.images,
      to: `/artists/${item.id}`,
    });
  });

  it('convert SimplePlaylist to ContentListItem', () => {
    const item = simplePlaylist(3);
    expect(convertToContentListItem('playlist')(item)).toEqual({
      type: 'playlist',
      id: item.id,
      name: item.name,
      uri: item.uri,
      externalUrls: item.external_urls,
      releaseId: item.id,
      images: item.images,
      to: `/playlists/${item.id}`,
    });
  });

  it('convert SimpleEpisode to ContentListItem', () => {
    const item = simpleShow(3);
    expect(convertToContentListItem('show')(item)).toEqual({
      type: 'show',
      id: item.id,
      name: item.name,
      uri: item.uri,
      externalUrls: item.external_urls,
      releaseId: item.id,
      images: item.images,
      to: `/shows/${item.id}`,
    });
  });

  it('convert SimpleEpisode to ContentListItem', () => {
    const item = simpleEpisode(3);
    expect(convertToContentListItem('episode')(item)).toEqual({
      type: 'episode',
      id: item.id,
      name: item.name,
      uri: item.uri,
      externalUrls: item.external_urls,
      releaseId: item.id,
      images: item.images,
      to: `/episodes/${item.id}`,
    });
  });
});
