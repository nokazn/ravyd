import { convertMinimumArtist } from './convertArtist';
import { minimumArtist } from '~/tests/fixtures';

describe('converter/convertMinimumArtist', () => {
  it('extract ID from artist URI', () => {
    const artist = minimumArtist(1);
    expect(convertMinimumArtist(artist)).toEqual({
      ...artist,
      id: 'artist1',
    });
  });
});
