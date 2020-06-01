/* eslint-disable no-param-reassign */
import { Mutations } from 'vuex';
import { LibraryTracksState } from './state';
import { App } from '~~/types';

export type LibraryTracksMutations = {
  SET_TRACK_LIST: App.PlaylistTrackDetail[] | null
  ADD_TO_TRACK_LIST: App.PlaylistTrackDetail[] | null
  UNSHIFT_TO_TRACK_LIST: App.PlaylistTrackDetail[] | null
  SET_IS_FULL_TRACK_LIST: boolean
  INCREMENT_NUMBER_OF_UNUPDATED_TRACKS: void
  RESET_NUMBER_OF_UNUPDATED_TRACKS: void
};

export type RootMutations = {
  'library/tracks/SET_TRACK_LIST': LibraryTracksMutations['SET_TRACK_LIST'];
  'library/tracks/ADD_TO_TRACK_LIST': LibraryTracksMutations['ADD_TO_TRACK_LIST'];
  'library/tracks/UNSHIFT_TO_TRACK_LIST': LibraryTracksMutations['UNSHIFT_TO_TRACK_LIST'];
  'library/tracks/SET_IS_FULL_TRACK_LIST': LibraryTracksMutations['SET_IS_FULL_TRACK_LIST'];
  'library/tracks/INCREMENT_NUMBER_OF_UNUPDATED_TRACKS': LibraryTracksMutations['INCREMENT_NUMBER_OF_UNUPDATED_TRACKS'];
  'library/tracks/RESET_NUMBER_OF_UNUPDATED_TRACKS': LibraryTracksMutations['RESET_NUMBER_OF_UNUPDATED_TRACKS'];
};

const mutations: Mutations<LibraryTracksState, LibraryTracksMutations> = {
  SET_TRACK_LIST(state, trackList) {
    state.trackList = trackList;
  },

  ADD_TO_TRACK_LIST(state, trackList) {
    const currentTrackList = state.trackList;
    if (trackList != null) {
      state.trackList = currentTrackList != null
        ? [...currentTrackList, ...trackList]
        : trackList;
    }
  },

  UNSHIFT_TO_TRACK_LIST(state, trackList) {
    const currentTrackList = state.trackList;
    if (trackList != null) {
      state.trackList = currentTrackList != null
        ? [...trackList, ...currentTrackList]
        : trackList;
    }
  },

  SET_IS_FULL_TRACK_LIST(state, isFullTrackList) {
    state.isFullTrackList = isFullTrackList;
  },

  INCREMENT_NUMBER_OF_UNUPDATED_TRACKS(state) {
    const currentNumberOfUnupdatedTracks = state.numberOfUnupdatedTracks;
    state.numberOfUnupdatedTracks = currentNumberOfUnupdatedTracks + 1;
  },

  RESET_NUMBER_OF_UNUPDATED_TRACKS(state) {
    state.numberOfUnupdatedTracks = 0;
  },
};

export default mutations;
