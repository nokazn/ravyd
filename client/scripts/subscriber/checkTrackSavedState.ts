// import { RootMutations } from 'vuex';
import { RootMutations, SFCCommit } from 'vuex';
import { App } from '~~/types';

type MutationType = 'library/tracks/SET_ACTUAL_IS_SAVED'
type MutationPayload = {
  type: MutationType
  payload: RootMutations[MutationType]
}

// library/tracks/SET_ACTUAL_IS_SAVED を subscribe
export const checkTrackSavedState = <T extends App.SimpleTrackDetail | App.PlaylistTrackDetail>(
  mutation: MutationPayload, $commit: SFCCommit,
) => (currentTrackList: T[]): T[] => {
    const [id, isSaved] = mutation.payload;
    // @todo パフォーマンス
    const trackList = [...currentTrackList].map((track) => {
      const actualTrack = track.id === id
        ? { ...track, isSaved }
        : track;
      return actualTrack;
    });

    $commit('library/tracks/DELETE_ACTUAL_IS_SAVED', id);

    return trackList;
  };
