import {
  convertPlaylistTrackDetail,
  convertTrackDetail,
  convertTrackForCard,
  convertTrackForQueue,
} from './convertTrack';
import { convertAddedAt } from './convertText';
import { track, user } from '~/tests/fixtures';

describe('converter/convertPlaylistTrackDetail', () => {
  it('convert Track to PlaylistTrackDetail', () => {
    const item = track(3);
    const addedAt = new Date().toISOString();
    const addedBy = user(3);
    expect(convertPlaylistTrackDetail({
      isTrackSavedList: [false, false, true],
    })({
      track: item,
      added_at: addedAt,
      added_by: addedBy,
    }, 2)).toEqual({
      type: item.type,
      index: 2,
      name: item.name,
      id: item.id,
      uri: item.uri,
      trackNumber: item.track_number,
      discNumber: item.disc_number,
      artists: item.artists,
      featuredArtists: [],
      explicit: item.explicit,
      isPlayable: item.is_playable,
      durationMs: item.duration_ms,
      externalIds: item.external_ids,
      externalUrls: item.external_urls,
      previewUrl: item.preview_url,
      isSaved: true,
      releaseId: item.album.id,
      releaseName: item.album.name,
      images: item.album.images,
      linkedFrom: item.linked_from,
      addedAt: convertAddedAt(addedAt),
      addedBy,
    });
  });

  it('convert Track to PlaylistTrackDetail with offset', () => {
    const item = track(3);
    const addedAt = new Date().toISOString();
    const addedBy = user(3);
    expect(convertPlaylistTrackDetail({
      isTrackSavedList: [true, true, false],
      offset: 3,
    })({
      track: item,
      added_at: addedAt,
      added_by: addedBy,
    }, 2)).toEqual({
      type: item.type,
      index: 5,
      name: item.name,
      id: item.id,
      uri: item.uri,
      trackNumber: item.track_number,
      discNumber: item.disc_number,
      artists: item.artists,
      featuredArtists: [],
      explicit: item.explicit,
      isPlayable: item.is_playable,
      durationMs: item.duration_ms,
      externalIds: item.external_ids,
      externalUrls: item.external_urls,
      previewUrl: item.preview_url,
      isSaved: false,
      releaseId: item.album.id,
      releaseName: item.album.name,
      images: item.album.images,
      linkedFrom: item.linked_from,
      addedAt: convertAddedAt(addedAt),
      addedBy,
    });
  });
});

describe('converter/convertTrackDetail', () => {
  it('convert Track to TrackDetail', () => {
    const item = track(3);
    expect(convertTrackDetail({
      isTrackSavedList: [false, false, true],
    })(item, 2)).toEqual({
      index: 2,
      name: item.name,
      type: item.type,
      id: item.id,
      uri: item.uri,
      trackNumber: item.track_number,
      discNumber: item.disc_number,
      artists: item.artists,
      featuredArtists: [],
      explicit: item.explicit,
      isPlayable: item.is_playable,
      durationMs: item.duration_ms,
      externalUrls: item.external_urls,
      previewUrl: item.preview_url,
      isSaved: true,
      releaseId: item.album.id,
      releaseName: item.album.name,
      images: item.album.images,
      linkedFrom: item.linked_from,
    });
  });

  it('convert Track to TrackDetail with offset', () => {
    const item = track(3);
    expect(convertTrackDetail({
      isTrackSavedList: [true, true, false],
      offset: 3,
    })(item, 2)).toEqual({
      index: 5,
      name: item.name,
      type: item.type,
      id: item.id,
      uri: item.uri,
      trackNumber: item.track_number,
      discNumber: item.disc_number,
      artists: item.artists,
      featuredArtists: [],
      explicit: item.explicit,
      isPlayable: item.is_playable,
      durationMs: item.duration_ms,
      externalUrls: item.external_urls,
      previewUrl: item.preview_url,
      isSaved: false,
      releaseId: item.album.id,
      releaseName: item.album.name,
      images: item.album.images,
      linkedFrom: item.linked_from,
    });
  });
});

describe('converter/convertTrackDetail', () => {
  it('convert Track to TrackForQueue', () => {
    const item = track(3);
    expect(convertTrackForQueue({
      isSet: true,
      isPlaying: true,
    })(item, 2)).toEqual({
      isSet: true,
      isPlaying: true,
      index: 2,
      type: item.type,
      id: item.id,
      name: item.name,
      uri: item.uri,
      releaseId: item.album.id,
      releaseName: item.album.name,
      artists: item.album.artists,
      images: item.album.images,
      linkedFrom: item.linked_from,
      durationMs: item.duration_ms,
    });
  });

  it('convert episode to TrackForQueue with offset', () => {
    const item = track(3);
    expect(convertTrackForQueue({
      isSet: false,
      isPlaying: false,
      offset: 3,
    })(item, 2)).toEqual({
      isSet: false,
      isPlaying: false,
      index: 5,
      type: item.type,
      id: item.id,
      name: item.name,
      uri: item.uri,
      releaseId: item.album.id,
      releaseName: item.album.name,
      artists: item.album.artists,
      images: item.album.images,
      linkedFrom: item.linked_from,
      durationMs: item.duration_ms,
    });
  });
});

describe('converter/convertTrackForCard', () => {
  it('convert Track to TrackForQueue', () => {
    const item = track(3);
    expect(convertTrackForCard(item)).toEqual({
      type: item.type,
      releaseId: item.album.id,
      id: item.id,
      name: item.name,
      uri: item.uri,
      artists: item.artists,
      images: item.album.images,
      externalUrls: item.external_urls,
      linkedFrom: item.linked_from,
    });
  });
});
