import {
  album,
  simpleAlbum,
  simpleArtist,
  image,
  externalUrls,
} from '~/tests/fixtures';
import { convertReleaseDate, convertReleaseForCard, convertReleaseType } from './convertRelease';

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
    const item = simpleAlbum(3);
    expect(convertReleaseForCard(item)).toEqual({
      type: item.type,
      releaseId: item.id,
      id: item.id,
      name: item.name,
      uri: item.uri,
      artists: [simpleArtist(0)],
      releaseYear: '2021年',
      images: [image(3)],
      externalUrls: externalUrls(3),
    });
  });

  it('convert Album', () => {
    const item = album(3);
    expect(convertReleaseForCard(album(3))).toEqual({
      type: item.type,
      releaseId: item.id,
      id: item.id,
      name: item.name,
      uri: item.uri,
      artists: [simpleArtist(0)],
      releaseYear: '2021年',
      images: [image(3)],
      externalUrls: externalUrls(3),
    });
  });
});
