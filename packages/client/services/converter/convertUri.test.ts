import { convertUriToId, convertUriToUrl } from './convertUri';

describe('converter/convertUri', () => {
  it('convert URI to ID', () => {
    expect(convertUriToId('spotify:artist:id1')).toBe('id1');
    expect(convertUriToId('spotify:playlist:id1')).toBe('id1');
    expect(convertUriToId('spotify:episode:id1')).toBe('id1');
    expect(convertUriToId('spotify:album:id1')).toBe('id1');
    expect(convertUriToId('spotify:track:id1')).toBe('id1');
    expect(convertUriToId('spotify:user:user1:id1')).toBe('id1');
  });

  it('convert URI to URI', () => {
    expect(convertUriToUrl('spotify:artist:id1')).toBe('/artists/id1');
    expect(convertUriToUrl('spotify:playlist:id1')).toBe('/playlists/id1');
    expect(convertUriToUrl('spotify:episode:id1')).toBe('/episodes/id1');
    expect(convertUriToUrl('spotify:album:id1')).toBe('/releases/id1');
    expect(convertUriToUrl('spotify:track:id1')).toBeUndefined();
    expect(convertUriToUrl('spotify:user:user1:collection')).toBe('/library/tracks');
    expect(convertUriToUrl('spotify:user:user1:history')).toBe('/library/history');
    expect(convertUriToUrl('user:user1:history')).toBeUndefined();
    expect(convertUriToUrl('spotify')).toBeUndefined();
  });
});
