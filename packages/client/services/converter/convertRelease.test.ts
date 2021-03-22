import { convertReleaseDate, convertReleaseForCard, convertReleaseType } from './convertRelease';
import {
  album,
  simpleAlbum,
  simpleArtist,
  image,
  externalUrls,
} from '~/tests/fixtures';

describe('converter/convertReleaseDate', () => {
  it('convert YYYY', () => {
    expect(convertReleaseDate({
      releaseDate: '2021',
      releaseDatePrecision: 'year',
    })).toBe('2021年');
  });

  it('convert YYYY-MM', () => {
    expect(convertReleaseDate({
      releaseDate: '2021-03',
      releaseDatePrecision: 'month',
    })).toBe('2021年3月');
  });

  it('convert YYYY-MM-DD', () => {
    expect(convertReleaseDate({
      releaseDate: '2021-03-22',
      releaseDatePrecision: 'day',
    })).toBe('2021年3月22日');
    expect(convertReleaseDate({
      releaseDate: '2021-03-22',
      releaseDatePrecision: 'day',
      format: 'YYYY/MM/DD',
    })).toBe('2021/03/22');
  });
});

describe('converter/convertReleaseType', () => {
  it('convert release type', () => {
    expect(convertReleaseType('album', 10)).toBe('アルバム');
    expect(convertReleaseType('single', 3)).toBe('シングル');
    expect(convertReleaseType('single', 4)).toBe('EP');
    expect(convertReleaseType('compilation', 10)).toBe('コンピレーション');
  });
});

describe('converter/convertReleaseForCard', () => {
  it('convert SimpleAlbum', () => {
    expect(convertReleaseForCard(simpleAlbum(3))).toEqual({
      type: 'album',
      releaseId: 'id3',
      id: 'id3',
      name: 'name3',
      uri: 'spotify:album:album3',
      artists: [simpleArtist(0)],
      releaseYear: '2021年',
      images: [image(3)],
      externalUrls: externalUrls(3),
    });
  });

  it('convert Album', () => {
    expect(convertReleaseForCard(album(3))).toEqual({
      type: 'album',
      releaseId: 'id3',
      id: 'id3',
      name: 'name3',
      uri: 'spotify:album:album3',
      artists: [simpleArtist(0)],
      releaseYear: '2021年',
      images: [image(3)],
      externalUrls: externalUrls(3),
    });
  });
});
