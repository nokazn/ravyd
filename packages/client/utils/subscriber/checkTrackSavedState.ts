import type { ExtendedMutationPayload, SFCCommit } from 'typed-vuex';
import type { App } from '~/entities';

type Track = App.TrackDetail | App.PlaylistTrackDetail

// library/tracks/SET_ACTUAL_IS_SAVED を subscribe
export const checkTrackSavedState = <T extends Track>(
  mutation: ExtendedMutationPayload<'library/tracks/SET_ACTUAL_IS_SAVED'>,
  $commit: SFCCommit,
) => (currentTrackList: T[]): T[] => {
    const [id, isSaved] = mutation.payload;
    // TODO: パフォーマンス
    const trackList = [...currentTrackList].map((track) => {
      const actualTrack = track.id === id
        ? { ...track, isSaved }
        : track;
      return actualTrack;
    });

    $commit('library/tracks/DELETE_ACTUAL_IS_SAVED', id);

    return trackList;
  };
