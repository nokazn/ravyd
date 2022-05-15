import { minimumArtist } from '~/tests/fixtures';
import { convertMinimumArtist } from './convertArtist';

describe('converter/convertMinimumArtist', () => {
  it('extract ID from artist URI', () => {
    const artist = minimumArtist(1);
    expect(convertMinimumArtist(artist)).toEqual({
      ...artist,
      id: 'artist1',
    });
  });
});
