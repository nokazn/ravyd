import dayjs from 'dayjs';
import { image } from '~/tests/fixtures';
import {
  convertAddedAt,
  generateContentPath,
  generateUserContextUri,
  getFollowersText,
  getImageSrc,
  nextRepeatState,
  parseCopyrights,
} from './convertText';

describe('converter/convertAddedAt', () => {
  it('convert addedAt', () => {
    const genTitle = (date: string) => dayjs(date).format('YYYY/M/D H:mm');
    const now = new Date().toISOString();
    expect(convertAddedAt(now)).toEqual({
      origin: now,
      text: '数秒前',
      title: genTitle(now),
    });
    const former = '1970-03-22T21:53:42Z';
    expect(convertAddedAt(former)).toEqual({
      origin: former,
      text: undefined,
      title: genTitle(former),
    });
  });
});

describe('converter/generateContentPath', () => {
  it('generate release url', () => {
    const id = 'id3';
    const trackId = 'trackId2';
    expect(generateContentPath('album', id)).toBe(`/releases/${id}`);
    expect(generateContentPath('artist', id)).toBe(`/artists/${id}`);
    expect(generateContentPath('track', id, trackId)).toEqual({
      path: `/releases/${id}`,
      query: { track: trackId },
    });
    expect(generateContentPath('playlist', id)).toBe(`/playlists/${id}`);
    expect(generateContentPath('show', id)).toBe(`/shows/${id}`);
    expect(generateContentPath('episode', id)).toBe(`/episodes/${id}`);
  });
});

describe('converter/generateUserContextUri', () => {
  expect(generateUserContextUri('id3', 'collection')).toBe('spotify:user:id3:collection');
  expect(generateUserContextUri('id3', 'history')).toBe('spotify:user:id3:history');
  expect(generateUserContextUri(undefined, 'collection')).toBeUndefined();
});

describe('converter/getFollowersText', () => {
  expect(getFollowersText(2)).toBe('フォロワー 2人');
  expect(getFollowersText(2000000)).toBe('フォロワー 2,000,000人');
  expect(getFollowersText(null)).toBeUndefined();
});

describe('converter/getImageSrc', () => {
  it('get the url of image with the smallest size that exceeds minSize argument (random order)', () => {
    const images = [image(1, 64), image(2, 600), image(3, 300)];
    // maximum size image
    expect(getImageSrc(images)).toBe(image(2).url);
    expect(getImageSrc(images, 32)).toBe(image(1).url);
    expect(getImageSrc(images, 63)).toBe(image(1).url);
    expect(getImageSrc(images, 64)).toBe(image(1).url);
    expect(getImageSrc(images, 65)).toBe(image(3).url);
    expect(getImageSrc(images, 299)).toBe(image(3).url);
    expect(getImageSrc(images, 300)).toBe(image(3).url);
    expect(getImageSrc(images, 301)).toBe(image(2).url);
    expect(getImageSrc(images, 600)).toBe(image(2).url);
    expect(getImageSrc(images, 601)).toBe(image(2).url);
  });

  it('get the url of image with the smallest size that exceeds minSize argument (ascend order)', () => {
    const images = [image(1, 64), image(2, 300), image(3, 600)];
    // maximum size image
    expect(getImageSrc(images)).toBe(image(3).url);
    expect(getImageSrc(images, 32)).toBe(image(1).url);
    expect(getImageSrc(images, 63)).toBe(image(1).url);
    expect(getImageSrc(images, 64)).toBe(image(1).url);
    expect(getImageSrc(images, 65)).toBe(image(2).url);
    expect(getImageSrc(images, 299)).toBe(image(2).url);
    expect(getImageSrc(images, 300)).toBe(image(2).url);
    expect(getImageSrc(images, 301)).toBe(image(3).url);
    expect(getImageSrc(images, 600)).toBe(image(3).url);
    expect(getImageSrc(images, 601)).toBe(image(3).url);
  });

  it('get the url of image with the smallest size that exceeds minSize argument (descend order)', () => {
    const images = [image(1, 600), image(2, 300), image(3, 64)];
    // maximum size image
    expect(getImageSrc(images)).toBe(image(1).url);
    expect(getImageSrc(images, 32)).toBe(image(3).url);
    expect(getImageSrc(images, 63)).toBe(image(3).url);
    expect(getImageSrc(images, 64)).toBe(image(3).url);
    expect(getImageSrc(images, 65)).toBe(image(2).url);
    expect(getImageSrc(images, 299)).toBe(image(2).url);
    expect(getImageSrc(images, 300)).toBe(image(2).url);
    expect(getImageSrc(images, 301)).toBe(image(1).url);
    expect(getImageSrc(images, 600)).toBe(image(1).url);
    expect(getImageSrc(images, 601)).toBe(image(1).url);
  });
});

describe('converter/nextRepeatState', () => {
  it('get next repeat mode & repeat state', () => {
    expect(nextRepeatState(0)).toEqual([1, 'context']);
    expect(nextRepeatState(1)).toEqual([2, 'track']);
    expect(nextRepeatState(2)).toEqual([0, 'off']);
    expect(nextRepeatState('off')).toEqual([1, 'context']);
    expect(nextRepeatState('context')).toEqual([2, 'track']);
    expect(nextRepeatState('track')).toEqual([0, 'off']);
  });
});


describe('converter/parseCopyrights', () => {
  it('', () => {
    expect(parseCopyrights([
      {
        type: 'C',
        text: 'copyrights',
      },
      {
        type: 'C',
        text: 'Ⓒ copyrights',
      },
      {
        type: 'C',
        text: '🄫 copyrights',
      },
      {
        type: 'C',
        text: '© copyrights',
      },
      {
        type: 'C',
        text: 'ⓒ copyrights',
      },
      {
        type: 'C',
        text: '⒞ copyrights',
      },
    ])).toEqual(['© copyrights']);
    expect(parseCopyrights([
      {
        type: 'C',
        text: 'copyrights',
      },
      {
        type: 'C',
        text: 'ⓒ another copyrights',
      },
    ])).toEqual(['© copyrights', '© another copyrights']);

    expect(parseCopyrights([
      {
        type: 'P',
        text: 'copyrights',
      },
      {
        type: 'P',
        text: 'Ⓟ copyrights',
      },
      {
        type: 'P',
        text: 'ⓟ copyrights',
      },
      {
        type: 'P',
        text: '℗ copyrights',
      },
      {
        type: 'P',
        text: '⒫ copyrights',
      },
    ])).toEqual(['℗ copyrights']);
    expect(parseCopyrights([
      {
        type: 'P',
        text: 'copyrights',
      },
      {
        type: 'P',
        text: '℗ another copyrights',
      },
    ])).toEqual(['℗ copyrights', '℗ another copyrights']);

    expect(parseCopyrights([
      {
        type: 'C',
        text: 'copyrights',
      },
      {
        type: 'C',
        text: 'Ⓒ copyrights',
      },
      {
        type: 'C',
        text: '🄫 another copyrights',
      },
      {
        type: 'C',
        text: '© copyrights',
      },
      {
        type: 'C',
        text: 'ⓒ another copyrights',
      },
      {
        type: 'C',
        text: '⒞ copyrights',
      },
      {
        type: 'P',
        text: 'copyrights',
      },
      {
        type: 'P',
        text: 'Ⓟ another copyrights',
      },
      {
        type: 'P',
        text: 'ⓟ copyrights',
      },
      {
        type: 'P',
        text: '℗ another copyrights',
      },
      {
        type: 'P',
        text: '⒫ copyrights',
      },
    ])).toEqual(['©℗ copyrights', '©℗ another copyrights']);
  });
});
