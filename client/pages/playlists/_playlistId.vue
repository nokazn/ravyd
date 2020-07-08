<template>
  <div
    v-if="playlistInfo != null"
    :class="$style.PlaylistIdPage"
  >
    <div :class="$style.PlaylistIdPage__header">
      <ReleaseArtwork
        :src="playlistInfo.artworkSrc"
        :alt="playlistInfo.name"
        :size="ARTWORK_SIZE"
        :title="playlistInfo.name"
        shadow
      />

      <div :class="$style.PlaylistIdPage__info">
        <div class="g-small-text">
          プレイリスト
          <v-icon
            v-if="!playlistInfo.isPublic && isOwnPlaylist"
            small
            color="subtext"
            title="非公開のプレイリスト"
          >
            mdi-lock
          </v-icon>
        </div>

        <h1 :class="$style.PlaylistIdPage__playlistName">
          {{ playlistInfo.name }}
        </h1>

        <p
          v-if="playlistInfo.description"
          class="subtext--text"
          v-html="playlistInfo.description"
        />

        <div>
          <UserName :user="playlistInfo.owner" />
        </div>

        <div :class="$style.PlaylistIdPage__playlistInfoFooter">
          <div :class="$style.PlaylistIdPage__buttons">
            <ContextMediaButton
              :is-playing="isPlaylistSet && isPlaying"
              :disabled="!hasTracks"
              @on-clicked="onContextMediaButtonClicked"
            />

            <template v-if="isOwnPlaylist">
              <CircleButton
                outlined
                title="編集する"
                @on-clicked="editPlaylistModal = true"
              >
                mdi-pencil
              </CircleButton>
              <EditPlaylistModal
                :is-shown="editPlaylistModal"
                :form="editPlaylistForm"
                @on-changed="onEditPlaylistModalChanged"
              />
            </template>

            <FavoriteButton
              v-else
              :is-favorited="playlistInfo.isFollowing"
              outlined
              @on-clicked="onFollowButtonClicked"
            />
          </div>

          <div :class="$style.PlaylistIdPage__playlistDetail">
            <ReleaseTotalTracks
              :total-tracks="playlistInfo.totalTracks"
            />

            <ReleaseDuration
              :duration-ms="playlistInfo.durationMs"
            />

            <Followers
              v-if="playlistInfo.followersText != null"
              :text="playlistInfo.followersText"
            />
          </div>
        </div>
      </div>
    </div>

    <PlaylistTrackTable
      v-if="playlistTrackInfo != null"
      :track-list="playlistTrackInfo.trackList"
      :playlist-id="playlistInfo.id"
      :uri="playlistInfo.uri"
      @on-favorite-button-clicked="onFavoriteTrackButtonClicked"
    />

    <IntersectionLoadingCircle
      v-if="playlistTrackInfo != null"
      :is-loading="!playlistTrackInfo.isFullTrackList"
      @on-appeared="appendTrackList"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { RootState, ExtendedMutationPayload } from 'vuex';

import ReleaseArtwork from '~/components/parts/avatar/ReleaseArtwork.vue';
import PlaylistTrackTable, { On as OnTable } from '~/components/containers/table/PlaylistTrackTable.vue';
import UserName from '~/components/parts/text/UserName.vue';
import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';
import FavoriteButton, { On as OnFollowButton } from '~/components/parts/button/FavoriteButton.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import Followers from '~/components/parts/text/Followers.vue';
import EditPlaylistModal, { On as OnEditModal, Form } from '~/components/parts/modal/EditPlaylistModal.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';

import { getPlaylistInfo, getPlaylistTrackInfoHandler } from '~/scripts/localPlugins/_playlistId';
import { checkTrackSavedState } from '~/scripts/subscriber/checkTrackSavedState';
import { App } from '~~/types';

const ARTWORK_SIZE = 220;
const LIMIT_OF_TRACKS = 30;

interface AsyncData {
  ARTWORK_SIZE: number
  playlistInfo: App.PlaylistInfo | undefined
  playlistTrackInfo: App.PlaylistTrackInfo | undefined
  getPlaylistTrackInfo: ReturnType<typeof getPlaylistTrackInfoHandler> | undefined
}

interface Data {
  editPlaylistModal: boolean
  mutationUnsubscribe: (() => void) | undefined
}

@Component({
  components: {
    ReleaseArtwork,
    PlaylistTrackTable,
    UserName,
    ContextMediaButton,
    CircleButton,
    FavoriteButton,
    ReleaseTotalTracks,
    ReleaseDuration,
    Followers,
    EditPlaylistModal,
    IntersectionLoadingCircle,
  },

  validate({ params }) {
    return params.playlistId !== '';
  },

  async asyncData(context): Promise<AsyncData> {
    const getPlaylistTrackInfo = getPlaylistTrackInfoHandler(context);
    const [playlistInfo, playlistTrackInfo] = await Promise.all([
      await getPlaylistInfo(context, ARTWORK_SIZE),
      await getPlaylistTrackInfo({ limit: LIMIT_OF_TRACKS }),
    ]);

    return {
      ARTWORK_SIZE,
      playlistInfo,
      playlistTrackInfo,
      getPlaylistTrackInfo,
    };
  },
})
export default class PlaylistIdPage extends Vue implements AsyncData, Data {
  ARTWORK_SIZE = ARTWORK_SIZE;
  playlistInfo: App.PlaylistInfo | undefined = undefined;
  playlistTrackInfo: App.PlaylistTrackInfo | undefined = undefined;
  getPlaylistTrackInfo: ReturnType<typeof getPlaylistTrackInfoHandler> | undefined = undefined;

  editPlaylistModal = false;
  mutationUnsubscribe: (() => void) | undefined = undefined;

  head() {
    return {
      title: this.playlistInfo?.name ?? 'エラー',
    };
  }

  mounted() {
    if (this.playlistInfo?.artworkSrc != null) {
      this.$dispatch('extractDominantBackgroundColor', this.playlistInfo.artworkSrc);
    } else {
      this.$dispatch('setDefaultDominantBackgroundColor');
    }

    // トラックを保存/削除した後呼ばれる
    const subscribeTrack = (mutationPayload: ExtendedMutationPayload<'library/tracks/SET_ACTUAL_IS_SAVED'>) => {
      if (this.playlistTrackInfo == null) return;

      const trackList = checkTrackSavedState<App.PlaylistTrackDetail>(
        mutationPayload,
        this.$commit,
      )(this.playlistTrackInfo.trackList);

      this.playlistTrackInfo = {
        ...this.playlistTrackInfo,
        trackList,
      };
    };

    const subscribeFollowedPlaylist = (mutationPayload: ExtendedMutationPayload<'playlists/SET_ACTUAL_IS_SAVED'>) => {
      if (this.playlistInfo == null) return;

      const [playlistId, isFollowing] = mutationPayload.payload;
      if (playlistId === this.playlistInfo.id) {
        this.playlistInfo.isFollowing = isFollowing;
        this.$commit('playlists/DELETE_ACTUAL_IS_SAVED', playlistId);
      }
    };

    // プレイリストを編集した後呼ばれる
    const subscribeEditedPlaylist = (mutationPayload: ExtendedMutationPayload<'playlists/EDIT_PLAYLIST'>) => {
      if (this.playlistInfo == null) return;

      const {
        id, name, description, isPublic,
      } = mutationPayload.payload;
      if (id === this.playlistInfo.id) {
        this.playlistInfo = {
          ...this.playlistInfo,
          name,
          description,
          isPublic,
        };
      }
    };

    this.mutationUnsubscribe = this.$subscribe((mutation) => {
      const { type } = mutation;
      switch (type) {
        case 'library/tracks/SET_ACTUAL_IS_SAVED':
          subscribeTrack(mutation as ExtendedMutationPayload<typeof type>);
          break;

        case 'playlists/SET_ACTUAL_IS_SAVED':
          subscribeFollowedPlaylist(mutation as ExtendedMutationPayload<typeof type>);
          break;

        case 'playlists/EDIT_PLAYLIST':
          subscribeEditedPlaylist(mutation as ExtendedMutationPayload<typeof type>);
          break;

        default:
          break;
      }
    });
  }

  beforeDestroy() {
    if (this.mutationUnsubscribe != null) {
      this.mutationUnsubscribe();
      this.mutationUnsubscribe = undefined;
    }
  }

  get isPlaylistSet(): boolean {
    return this.$getters()['player/isContextSet'](this.playlistInfo?.uri);
  }
  get isPlaying(): RootState['player']['isPlaying'] {
    return this.$state().player.isPlaying;
  }
  get isOwnPlaylist(): boolean {
    return this.playlistInfo != null
      ? this.playlistInfo?.owner.id === this.$getters()['auth/userId']
      : false;
  }
  get hasTracks(): boolean {
    return this.playlistTrackInfo != null
      ? this.playlistTrackInfo.trackList.length > 0
      : false;
  }
  get editPlaylistForm(): Form | undefined {
    if (this.playlistInfo == null) return undefined;

    const {
      name, description, artworkSrc, isPublic,
    } = this.playlistInfo;

    return {
      playlistId: this.$route.params.playlistId,
      name,
      description: description ?? '',
      artworkSrc,
      isPrivate: isPublic != null
        ? !isPublic
        : false,
    };
  }

  async appendTrackList() {
    if (this.playlistTrackInfo == null
      || this.playlistTrackInfo.isFullTrackList
      || typeof this.getPlaylistTrackInfo !== 'function') return;

    const currentTrackList = this.playlistTrackInfo.trackList;
    const offset = currentTrackList.length;
    const trackInfo = await this.getPlaylistTrackInfo({
      limit: LIMIT_OF_TRACKS,
      offset,
    });
    if (trackInfo == null) {
      this.playlistTrackInfo.isFullTrackList = true;
      return;
    }

    this.playlistTrackInfo = {
      ...this.playlistTrackInfo,
      trackList: [...currentTrackList, ...trackInfo.trackList],
      isFullTrackList: trackInfo.isFullTrackList,
    };
  }

  onContextMediaButtonClicked(nextPlayingState: OnMediaButton['on-clicked']) {
    if (this.playlistInfo == null) return;

    if (nextPlayingState) {
      this.$dispatch('player/play', this.isPlaylistSet
        ? undefined
        : { contextUri: this.playlistInfo.uri });
    } else {
      this.$dispatch('player/pause');
    }
  }

  onEditPlaylistModalChanged(isShown: OnEditModal['on-changed']) {
    this.editPlaylistModal = isShown;
  }

  async onFollowButtonClicked(nextFollowingState: OnFollowButton['on-clicked']) {
    if (this.playlistInfo == null) return;

    // API との通信の結果を待たずに先に表示を変更させておく
    this.playlistInfo.isFollowing = nextFollowingState;
    const playlistId = this.playlistInfo.id;
    if (nextFollowingState) {
      await this.$spotify.following.followPlaylist({ playlistId });
      this.$dispatch('playlists/followPlaylist', playlistId)
        .catch((err) => {
          console.error({ err });
          this.$toast.show('error', err.message);
        });
    } else {
      this.$dispatch('playlists/unfollowPlaylist', playlistId)
        .catch((err: Error) => {
          console.error({ err });
          this.$toast.show('error', err.message);
        });
    }
  }

  onFavoriteTrackButtonClicked(row: OnTable['on-favorite-button-clicked']) {
    if (this.playlistTrackInfo == null) return;

    const nextTrackList = [...this.playlistTrackInfo.trackList];
    nextTrackList[row.index].isSaved = !row.isSaved;
    this.playlistTrackInfo = {
      ...this.playlistTrackInfo,
      trackList: nextTrackList,
    };
  }
}
</script>

<style lang="scss" module>
.PlaylistIdPage {
  padding: 16px 6% 48px;

  &__header {
    display: flex;
    margin-bottom: 32px;

    & > *:not(:last-child) {
      margin-right: 24px;
    }
  }

  &__info {
    display: inline-flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  &__playlistName {
    font-size: 40px;
    margin: 8px 0;
    line-height: 1.2em;
  }

  &__playlistInfoFooter {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    margin-top: 12px;
  }

  &__buttons {
    margin-right: 24px;

    & > *:not(:last-child) {
      margin-right: 12px;
    }
  }

  &__playlistDetail {
    margin-top: 12px;

    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>
