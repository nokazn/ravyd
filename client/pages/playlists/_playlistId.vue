<template>
  <div
    v-if="playlistInfo != null"
    :class="$style.PlaylistIdPage"
  >
    <portal :to="$header.PORTAL_NAME">
      <div
        v-if="playlistInfo != null"
        :class="$style.AdditionalHeaderContent"
      >
        <ContextMediaButton
          :height="32"
          :is-playing="isPlaylistSet && isPlaying"
          :disabled="!hasTracks"
          @on-clicked="onContextMediaButtonClicked"
        />

        <template v-if="playlistInfo.isOwnPlaylist">
          <CircleButton
            :size="32"
            outlined
            title="編集する"
            @on-clicked="editPlaylistModal = true"
          >
            mdi-pencil
          </CircleButton>
        </template>

        <FavoriteButton
          v-else
          :size="32"
          outlined
          :is-favorited="isFollowing"
          @on-clicked="toggleFollowingState"
        />

        <PlaylistMenu
          :playlist="playlistInfo"
          :is-following="isFollowing"
          :size="32"
          outlined
          left
          @on-edit-menu-clicked="toggleEditPlaylistModal"
          @on-follow-menu-clicked="toggleFollowingState"
        />
      </div>
    </portal>

    <div
      v-if="playlistInfo != null"
      :ref="HEADER_REF"
      :class="$style.PlaylistIdPage__header"
    >
      <ReleaseArtwork
        :src="artworkSrc"
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
                :size="36"
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
              outlined
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
      :class="$style.PlaylistIdPage__table"
      @on-favorite-button-clicked="toggleTrackFavoritState"
    />

    <IntersectionLoadingCircle
      v-if="playlistTrackInfo != null"
      :is-loading="!playlistTrackInfo.isFullTrackList"
      @on-appeared="appendTrackList"
    />
  </div>

  <Fallback v-else>
    プレイリストの情報を取得できませんでした。
  </Fallback>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { RootState, ExtendedMutationPayload } from 'vuex';

import ReleaseArtwork from '~/components/parts/avatar/ReleaseArtwork.vue';
import PlaylistTrackTable, { On as OnTable } from '~/components/containers/table/PlaylistTrackTable.vue';
import UserName from '~/components/parts/text/UserName.vue';
import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';
import FavoriteButton, { On as OnFavoriteButton } from '~/components/parts/button/FavoriteButton.vue';
import PlaylistMenu, { On as OnMenu } from '~/components/containers/menu/PlaylistMenu.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import Followers from '~/components/parts/text/Followers.vue';
import EditPlaylistModal, { On as OnEditModal, Form } from '~/components/parts/modal/EditPlaylistModal.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import Fallback from '~/components/parts/others/Fallback.vue';

import { getPlaylistInfo, getIsFollowing, getPlaylistTrackInfo } from '~/plugins/local/_playlistId';
import { convertPlaylistTrackDetail } from '~/scripts/converter/convertPlaylistTrackDetail';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { checkTrackSavedState } from '~/scripts/subscriber/checkTrackSavedState';
import { App } from '~~/types';

const ARTWORK_SIZE = 220;
const LIMIT_OF_TRACKS = 30;
const HEADER_REF = 'HEADER_REF';

interface AsyncData {
  playlistInfo: App.PlaylistInfo | undefined
  isFollowing: boolean
  playlistTrackInfo: App.PlaylistTrackInfo | undefined
}

interface Data {
  editPlaylistModal: boolean
  mutationUnsubscribe: (() => void) | undefined
  ARTWORK_SIZE: number
  HEADER_REF: string
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
    Fallback,
  },

  validate({ params }) {
    return params.playlistId !== '';
  },

  async asyncData(context): Promise<AsyncData> {
    const [
      playlistInfo,
      isFollowing,
      playlistTrackInfo,
    ] = await Promise.all([
      await getPlaylistInfo(context),
      await getIsFollowing(context),
      await getPlaylistTrackInfo(context, { limit: LIMIT_OF_TRACKS }),
    ]);

    return {
      playlistInfo,
      isFollowing,
      playlistTrackInfo,
    };
  },
})
export default class PlaylistIdPage extends Vue implements AsyncData, Data {
  playlistInfo: App.PlaylistInfo | undefined = undefined;
  isFollowing = false;
  playlistTrackInfo: App.PlaylistTrackInfo | undefined = undefined;

  editPlaylistModal = false;
  mutationUnsubscribe: (() => void) | undefined = undefined;
  ARTWORK_SIZE = ARTWORK_SIZE;
  HEADER_REF = HEADER_REF;

  head() {
    return {
      title: this.playlistInfo?.name ?? 'エラー',
    };
  }

  mounted() {
    // ボタンが見えなくなったらヘッダーに表示
    if (this.playlistInfo != null) {
      const ref = this.$refs[HEADER_REF] as HTMLDivElement;
      this.$header.observe(ref);
    }

    // 小さい画像から抽出
    const artworkSrc = getImageSrc(this.playlistInfo?.artworkList, 40);
    if (artworkSrc != null) {
      this.$dispatch('extractDominantBackgroundColor', artworkSrc);
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
      }

      this.$commit('playlists/DELETE_ACTUAL_IS_SAVED', playlistId);
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

    // アイテムを追加した後呼ばれる
    const subscribeAddedItem = async (mutationPayload: ExtendedMutationPayload<'playlists/INCREMENT_UNUPDATED_TRACKS_MAP'>) => {
      if (this.playlistInfo == null || this.playlistTrackInfo == null) return;

      const [playlistId, limit] = mutationPayload.payload;
      const { isFullTrackList } = this.playlistTrackInfo;
      // すべて読み込み済みの表示中のプレイリストにアイテムが追加された場合
      if (playlistId === this.$route.params.playlistId || isFullTrackList) {
        await this.appendTrackList(limit);
        const { playlistInfo } = this;
        this.playlistInfo = {
          ...playlistInfo,
          totalTracks: playlistInfo.totalTracks + limit,
        };
      }

      this.$commit('playlists/DELETE_UNUPDATED_TRACKS_MAP', playlistId);
    };

    // アイテムを削除した後呼ばれる
    const subscribeRemovedItem = (mutationPayload: ExtendedMutationPayload<'playlists/SET_ACTUALLY_DELETED_TRACK'>) => {
      if (this.playlistInfo == null || this.playlistTrackInfo == null) return;

      const [playlistId, { uri, positions: [index] }] = mutationPayload.payload;
      if (playlistId === this.$route.params.playlistId) {
        const currentTrackInfo = this.playlistTrackInfo;
        const removedItem = currentTrackInfo
          .trackList[index] as App.PlaylistTrackDetail | undefined;
        if (removedItem == null || removedItem.uri !== uri) return;

        const unmodifiedTrackList = currentTrackInfo.trackList.slice(0, index);
        // index 番目の要素を除き、残りの後ろの要素のインデックスを変更
        const modifiedTrackList = currentTrackInfo.trackList
          .slice(index + 1, currentTrackInfo.trackList.length)
          .map((track) => ({
            ...track,
            index: track.index - 1,
          }));
        this.playlistTrackInfo = {
          ...currentTrackInfo,
          trackList: [...unmodifiedTrackList, ...modifiedTrackList],
        };

        const { playlistInfo } = this;
        this.playlistInfo = {
          ...playlistInfo,
          totalTracks: playlistInfo.totalTracks - 1,
        };
      }

      this.$commit('playlists/DELETE_ACTUALLY_DELETED_TRACK', playlistId);
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

        case 'playlists/INCREMENT_UNUPDATED_TRACKS_MAP':
          subscribeAddedItem(mutation as ExtendedMutationPayload<typeof type>);
          break;

        case 'playlists/SET_ACTUALLY_DELETED_TRACK':
          subscribeRemovedItem(mutation as ExtendedMutationPayload<typeof type>);
          break;

        default:
          break;
      }
    });
  }

  beforeDestroy() {
    this.$header.disconnectObserver();

    if (this.mutationUnsubscribe != null) {
      this.mutationUnsubscribe();
      this.mutationUnsubscribe = undefined;
    }
  }

  get artworkSrc(): string | undefined {
    return getImageSrc(this.playlistInfo?.artworkList, ARTWORK_SIZE);
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
      name, description, artworkList, isPublic, isCollaborative,
    } = this.playlistInfo;

    return {
      playlistId: this.$route.params.playlistId,
      name,
      description: description ?? '',
      artworkList,
      isPrivate: isPublic != null
        ? !isPublic
        : false,
      isCollaborative,
    };
  }

  async appendTrackList(limit?: number) {
    if (this.playlistTrackInfo == null || this.playlistTrackInfo.isFullTrackList) return;

    const currentPlaylistTrackInfo = this.playlistTrackInfo;
    const offset = currentPlaylistTrackInfo.trackList.length;
    const tracks = await this.$spotify.playlists.getPlaylistItems({
      playlistId: this.$route.params.playlistId,
      market: this.$getters()['auth/userCountryCode'],
      limit: limit ?? LIMIT_OF_TRACKS,
      offset,
    });
    if (tracks == null) {
      this.playlistTrackInfo.isFullTrackList = true;
      return;
    }

    const filteredTrackList = tracks.items
      .filter(({ track }) => track != null) as App.FilteredPlaylistTrack[];
    if (filteredTrackList.length === 0) {
      this.playlistTrackInfo = {
        ...currentPlaylistTrackInfo,
        isFullTrackList: true,
      };
      return;
    }

    const trackIdList = filteredTrackList.map(({ track }) => track.id);
    const isTrackSavedList = await this.$spotify.library.checkUserSavedTracks({ trackIdList });
    const trackList = filteredTrackList.map(convertPlaylistTrackDetail({
      isTrackSavedList,
      offset,
    }));
    const isFullTrackList = tracks.next == null;

    this.playlistTrackInfo = {
      ...this.playlistTrackInfo,
      trackList: [...currentPlaylistTrackInfo.trackList, ...trackList],
      isFullTrackList,
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

  toggleFollowingState(nextFollowingState: OnFavoriteButton['on-clicked'] | OnMenu['on-follow-menu-clicked']) {
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
.AdditionalHeaderContent {
  display: flex;
  flex-wrap: nowrap;

  & > *:not(:last-child) {
    margin-right: 0.5vw;
  }
}

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

  &__table {
    margin-bottom: 32px;
  }
}
</style>
