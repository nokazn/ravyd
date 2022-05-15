import type { SpotifyAPI } from 'shared/types';
import { simpleEpisode, episode } from '~/tests/fixtures';
import { convertEpisodeDetail } from './convertEpisode';

describe('converter/convertEpisodeDetail', () => {
  it('convert SimpleEpisode', () => {
    const item = simpleEpisode(1);
    const showId = 'showId1';
    const showName = 'showname1';
    expect(convertEpisodeDetail<SpotifyAPI.SimpleEpisode>({
      offset: 15,
      showId,
      showName,
    })(item, 3)).toEqual({
      index: 18,
      id: item.id,
      name: item.name,
      uri: item.uri,
      description: item.description,
      images: item.images,
      isPlayable: item.is_playable,
      explicit: item.explicit,
      releaseDate: item.release_date,
      releaseDatePrecision: item.release_date_precision,
      durationMs: item.duration_ms,
      resumePoint: item.resume_point,
      externalUrls: item.external_urls,
      previewUrl: item.audio_preview_url,
      showId,
      showName,
    });
  });

  it('convert Episode', () => {
    const item = episode(1);
    expect(convertEpisodeDetail({ offset: 15 })(item, 3)).toEqual({
      index: 18,
      id: item.id,
      name: item.name,
      uri: item.uri,
      description: item.description,
      images: item.images,
      isPlayable: item.is_playable,
      explicit: item.explicit,
      releaseDate: item.release_date,
      releaseDatePrecision: item.release_date_precision,
      durationMs: item.duration_ms,
      resumePoint: item.resume_point,
      externalUrls: item.external_urls,
      previewUrl: item.audio_preview_url,
      showId: item.show.id,
      showName: item.show.name,
    });
  });
});
