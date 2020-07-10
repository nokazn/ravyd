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

      <div :class="$style.Info">
        <div class="g-small-text">
          プレイリスト
          <v-icon
            v-if="!playlistInfo.isPublic && playlistInfo.isOwnPlaylist"
            small
            color="subtext"
            title="非公開のプレイリスト"
          >
            mdi-lock
          </v-icon>
        </div>

        <h1 :class="$style.Info__playlistName">
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

        <div :class="$style.Info__footer">
          <div :class="$style.Info__buttons">
            <ContextMediaButton
              :is-playing="isPlaylistSet && isPlaying"
              :disabled="!hasTracks"
              @on-clicked="onContextMediaButtonClicked"
            />

            <template v-if="playlistInfo.isOwnPlaylist">
              <CircleButton
                outlined
                title="編集する"
                @on-clicked="editPlaylistModal = true"
              >
                mdi-pencil
              </CircleButton>
            </template>

            <FavoriteButton
              v-else
              :is-favorited="isFollowing"
              outlined
              @on-clicked="toggleFollowingState"
            />

            <PlaylistMenu
              :playlist="playlistInfo"
              :is-following="isFollowing"
              @on-edit-menu-clicked="toggleEditPlaylistModal"
              @on-follow-menu-clicked="toggleFollowingState"
            />
          </div>

          <div :class="$style.Info__detail">
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

    <EditPlaylistModal
      :is-shown="editPlaylistModal"
      :form="editPlaylistForm"
      @on-changed="toggleEditPlaylistModal"
    />

    <PlaylistTrackTable
      v-if="playlistTrackInfo != null"
      :track-list="playlistTrackInfo.trackList"
      :playlist-id="playlistInfo.isOwnPlaylist ? playlistInfo.id : undefined"
      :uri="playlistInfo.uri"
      @on-favorite-button-clicked="toggleTrackFavoritState"
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
import PlaylistMenu, { On as OnMenu } from '~/components/containers/menu/PlaylistMenu.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import Followers from '~/components/parts/text/Followers.vue';
import EditPlaylistModal, { On as OnEditModal, Form } from '~/components/parts/modal/EditPlaylistModal.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';

import { getPlaylistInfo, getIsFollowing, getPlaylistTrackInfoHandler } from '~/scripts/localPlugins/_playlistId';
import { checkTrackSavedState } from '~/scripts/subscriber/checkTrackSavedState';
import { App } from '~~/types';

const ARTWORK_SIZE = 220;
const LIMIT_OF_TRACKS = 30;

interface AsyncData {
  playlistInfo: App.PlaylistInfo | undefined
  isFollowing: boolean
  playlistTrackInfo: App.PlaylistTrackInfo | undefined
  getPlaylistTrackInfo: ReturnType<typeof getPlaylistTrackInfoHandler> | undefined
  ARTWORK_SIZE: number
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
    PlaylistMenu,
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
    const [
      playlistInfo,
      isFollowing,
      playlistTrackInfo,
    ] = await Promise.all([
      await getPlaylistInfo(context, ARTWORK_SIZE),
      await getIsFollowing(context),
      await getPlaylistTrackInfo({ limit: LIMIT_OF_TRACKS }),
    ]);

    return {
      playlistInfo,
      isFollowing,
      playlistTrackInfo,
      getPlaylistTrackInfo,
      ARTWORK_SIZE,
    };
  },
})
export default class PlaylistIdPage extends Vue implements AsyncData, Data {
  playlistInfo: App.PlaylistInfo | undefined = undefined;
  isFollowing = false;
  playlistTrackInfo: App.PlaylistTrackInfo | undefined = undefined;
  getPlaylistTrackInfo: ReturnType<typeof getPlaylistTrackInfoHandler> | undefined = undefined;
  ARTWORK_SIZE = ARTWORK_SIZE;

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

    // プレイリストをフォロー/アンフォローした後呼ばれる
    const subscribeFollowedPlaylist = (mutationPayload: ExtendedMutationPayload<'playlists/SET_ACTUAL_IS_SAVED'>) => {
      if (this.playlistInfo == null) return;

      const [playlistId, isFollowing] = mutationPayload.payload;
      if (playlistId === this.playlistInfo.id) {
        this.isFollowing = isFollowing;
        this.$commit('playlists/DELETE_ACTUAL_IS_SAVED', playlistId);
      }
    };

    // プレイリストを編集した後呼ばれる
    const subscribeEditedPlaylist = (mutationPayload: ExtendedMutationPayload<'playlists/EDIT_PLAYLIST'>) => {
      if (this.playlistInfo == null) return;

      const {
        id, name, description, isPublic, isCollaborative,
      } = mutationPayload.payload;
      if (id === this.playlistInfo.id) {
        this.playlistInfo = {
          ...this.playlistInfo,
          name: name ?? this.playlistInfo.name,
          // 空文字列の場合は null にする
          description: (description ?? this.playlistInfo.description) || null,
          isPublic: isPublic ?? this.playlistInfo.isPublic,
          isCollaborative: isCollaborative ?? this.playlistInfo.isCollaborative,
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
  get hasTracks(): boolean {
    return this.playlistTrackInfo != null
      ? this.playlistTrackInfo.trackList.length > 0
      : false;
  }
  get editPlaylistForm(): Form | undefined {
    if (this.playlistInfo == null) return undefined;

    const {
      name, description, artworkSrc, isPublic, isCollaborative,
    } = this.playlistInfo;

    return {
      playlistId: this.$route.params.playlistId,
      name,
      description: description ?? '',
      artworkSrc,
      isPrivate: isPublic != null
        ? !isPublic
        : false,
      isCollaborative,
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

  toggleEditPlaylistModal(isShown: OnEditModal['on-changed'] | OnMenu['on-edit-menu-clicked']) {
    this.editPlaylistModal = isShown;
  }

  toggleFollowingState(nextFollowingState: OnFollowButton['on-clicked'] | OnMenu['on-follow-menu-clicked']) {
    if (this.playlistInfo == null) return;

    // API との通信の結果を待たずに先に表示を変更させておく
    this.isFollowing = nextFollowingState;
    const playlistId = this.playlistInfo.id;
    if (nextFollowingState) {
      this.$dispatch('playlists/followPlaylist', playlistId);
    } else {
      this.$dispatch('playlists/unfollowPlaylist', {
        playlistId,
        isOwnPlaylist: this.playlistInfo.isOwnPlaylist,
      });
    }
  }

  toggleTrackFavoritState({ index, id, isSaved }: OnTable['on-favorite-button-clicked']) {
    if (this.playlistTrackInfo == null) return;

    const nextSavedState = !isSaved;
    // トラックの一覧のお気に入りの状態を変更
    const nextTrackList = [...this.playlistTrackInfo.trackList];
    nextTrackList[index].isSaved = nextSavedState;
    this.playlistTrackInfo = {
      ...this.playlistTrackInfo,
      trackList: nextTrackList,
    };

    if (nextSavedState) {
      this.$dispatch('library/tracks/saveTracks', [id]);
    } else {
      this.$dispatch('library/tracks/removeTracks', [id]);
    }
  }
}
</script>

<style lang="scss" module>
.PlaylistIdPage {
  padding: 16px 6% 48px;

  &__header {
    display: grid;
    grid-template-columns: 220px auto;
    grid-column-gap: 24px;
    margin-bottom: 32px;
  }

  .Info {
    display: inline-flex;
    flex-direction: column;
    justify-content: flex-end;

    &__playlistName {
      font-size: 40px;
      margin: 8px 0;
      line-height: 1.2em;
    }

    &__footer {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      margin-top: 12px;
    }

    &__buttons {
      display: flex;
      flex-wrap: nowrap;
      margin-right: 24px;

      & > *:not(:last-child) {
        margin-right: 12px;
      }
    }

    &__detail {
      margin-top: 12px;

      & > *:not(:last-child) {
        margin-right: 8px;
      }
    }
  }
}
</style>
