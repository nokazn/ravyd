<template>
  <div
    v-if="playlist != null"
    :class="$style.PlaylistIdPage"
  >
    <portal :to="$header.PORTAL_NAME">
      <div
        v-if="playlist != null"
        :class="$style.Fab"
      >
        <ContextMediaButton
          fab
          :disabled="!hasTracks"
          :value="isPlaylistSet && isPlaying"
          @input="onContextMediaButtonClicked"
        />

        <CircleButton
          v-if="playlist.isOwnPlaylist"
          title="編集する"
          :fab="$screen.isSingleColumn"
          :outlined="$screen.isMultiColumn"
          @click="toggleEditPlaylistModal(true)"
        >
          mdi-pencil
        </CircleButton>
        <FavoriteButton
          v-else
          :fab="$screen.isSingleColumn"
          :outlined="$screen.isMultiColumn"
          :value="isFollowing"
          @input="toggleFollowingState"
        />

        <PlaylistMenu
          left
          :fab="$screen.isSingleColumn"
          :outlined="$screen.isMultiColumn"
          :playlist="playlist"
          :following="isFollowing"
          @on-edit-menu-clicked="toggleEditPlaylistModal"
          @on-follow-menu-clicked="toggleFollowingState"
        />
      </div>
    </portal>

    <div
      :ref="HEADER_REF"
      :class="$style.PlaylistIdPage__header"
    >
      <ReleaseArtwork
        shadow
        :src="artworkSrc"
        :size="$screen.artworkSize"
        :alt="playlist.name"
        :title="playlist.name"
      />

      <div :class="$style.Info">
        <div class="g-small-text">
          プレイリスト
          <span v-if="playlist.isOwnPlaylist && !isFollowing">
            (削除済み)
          </span>
          <v-icon
            v-if="!playlist.isPublic && playlist.isOwnPlaylist"
            small
            color="subtext"
            title="非公開のプレイリスト"
          >
            mdi-lock
          </v-icon>
        </div>

        <h1 :class="$style.Info__title">
          {{ playlist.name }}
        </h1>

        <div>
          <UserName
            avatar
            :user="playlist.owner"
          />
        </div>

        <div :class="$style.Info__footer">
          <div :class="$style.Info__buttons">
            <ContextMediaButton
              :disabled="!hasTracks"
              :value="isPlaylistSet && isPlaying"
              @input="onContextMediaButtonClicked"
            />

            <CircleButton
              v-if="playlist.isOwnPlaylist"
              outlined
              title="編集する"
              :size="36"
              :disabled="!isFollowing"
              @click="toggleEditPlaylistModal(true)"
            >
              mdi-pencil
            </CircleButton>
            <FavoriteButton
              v-else
              outlined
              :value="isFollowing"
              @input="toggleFollowingState"
            />

            <PlaylistMenu
              outlined
              :playlist="playlist"
              :following="isFollowing"
              @on-edit-menu-clicked="toggleEditPlaylistModal(true)"
              @on-follow-menu-clicked="toggleFollowingState"
            />
          </div>

          <PlaylistDetailWrapper
            :playlist="playlist"
            :class="$style.Info__detail"
          />
        </div>
      </div>
    </div>

    <EditPlaylistModal
      v-model="editPlaylistModal"
      :form="editPlaylistForm"
    />

    <p
      v-if="playlist.description"
      class="subtext--text"
      :class="$style.PlaylistIdPage__description"
      v-html="playlist.description"
    />

    <template v-if="playlistTracks != null">
      <PlaylistTrackTable
        :tracks="playlistTracks.items"
        :playlist-id="playlist.isOwnPlaylist ? playlist.id : undefined"
        :uri="playlist.uri"
        :class="$style.PlaylistIdPage__table"
        @on-favorite-button-clicked="toggleTrackFavoritState"
      />
      <IntersectionLoadingCircle
        :loading="playlistTracks.hasNext"
        @appear="appendTrackList"
      />
    </template>
  </div>

  <Fallback v-else>
    プレイリストの情報を取得できませんでした。
  </Fallback>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { RootState, ExtendedMutationPayload } from 'typed-vuex';

import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import PlaylistTrackTable, { On as OnTable } from '~/components/containers/table/PlaylistTrackTable.vue';
import UserName from '~/components/parts/text/UserName.vue';
import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';
import FavoriteButton, { On as OnFavoriteButton } from '~/components/parts/button/FavoriteButton.vue';
import PlaylistMenu, { On as OnMenu } from '~/components/containers/menu/PlaylistMenu.vue';
import PlaylistDetailWrapper from '~/components/parts/wrapper/PlaylistDetailWrapper.vue';
import EditPlaylistModal, { On as OnEditModal, Form } from '~/components/containers/modal/EditPlaylistModal.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import Fallback from '~/components/parts/others/Fallback.vue';

import {
  getPlaylist,
  getIsFollowing,
  getPlaylistTracks,
  PlaylistTracks,
} from '~/services/local/_playlistId';
import { convertPlaylistTrackDetail, getImageSrc } from '~/services/converter';
import { checkTrackSavedState } from '~/utils/subscriber';
import type { App, OneToFifty, SpotifyAPI } from '~~/types';

const LIMIT_OF_TRACKS = 30;
const HEADER_REF = 'HEADER_REF';

interface AsyncData {
  playlist: App.PlaylistPage | undefined;
  isFollowing: boolean;
  playlistTracks: PlaylistTracks | undefined;
}

interface Data {
  editPlaylistModal: boolean;
  mutationUnsubscribe: (() => void) | undefined;
  HEADER_REF: string;
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
    PlaylistDetailWrapper,
    EditPlaylistModal,
    IntersectionLoadingCircle,
    Fallback,
  },

  validate({ params }) {
    return params.playlistId != null && params.playlistId !== '';
  },

  async asyncData(context): Promise<AsyncData> {
    const [
      playlist,
      isFollowing,
      playlistTracks,
    ] = await Promise.all([
      await getPlaylist(context),
      await getIsFollowing(context),
      await getPlaylistTracks(context, { limit: LIMIT_OF_TRACKS }),
    ] as const);

    return {
      playlist,
      isFollowing,
      playlistTracks,
    };
  },
})
export default class PlaylistIdPage extends Vue implements AsyncData, Data {
  playlist: App.PlaylistPage | undefined = undefined;
  isFollowing = false;
  playlistTracks: PlaylistTracks | undefined = undefined;

  editPlaylistModal = false;
  mutationUnsubscribe: (() => void) | undefined = undefined;
  HEADER_REF = HEADER_REF;

  head() {
    return {
      title: this.playlist?.name ?? 'エラー',
    };
  }

  get artworkSrc(): string | undefined {
    return getImageSrc(this.playlist?.images, this.$constant.ARTWORK_BASE_SIZE);
  }
  get isPlaylistSet(): boolean {
    return this.$getters()['playback/isContextSet'](this.playlist?.uri);
  }
  get isPlaying(): RootState['playback']['isPlaying'] {
    return this.$state().playback.isPlaying;
  }
  get hasTracks(): boolean {
    return this.playlistTracks != null
      ? this.playlistTracks.items.length > 0
      : false;
  }
  get editPlaylistForm(): Form | undefined {
    if (this.playlist == null) return undefined;

    const {
      name,
      description,
      images,
      isPublic,
      isCollaborative,
    } = this.playlist;
    return {
      playlistId: this.$route.params.playlistId,
      name,
      description: description ?? '',
      images,
      isPrivate: isPublic != null
        ? !isPublic
        : false,
      isCollaborative,
    };
  }

  mounted() {
    // ボタンが見えなくなったらヘッダーに表示
    if (this.playlist != null) {
      const ref = this.$refs[HEADER_REF] as HTMLDivElement;
      this.$header.observe(ref);
    }

    // 小さい画像から抽出
    const artworkSrc = getImageSrc(this.playlist?.images, 40);
    if (artworkSrc != null) {
      this.$dispatch('extractDominantBackgroundColor', artworkSrc);
    } else {
      this.$dispatch('setDefaultDominantBackgroundColor');
    }

    // トラックを保存/削除した後呼ばれる
    const subscribeTrack = (mutationPayload: ExtendedMutationPayload<'library/tracks/SET_ACTUAL_IS_SAVED'>) => {
      if (this.playlistTracks == null) return;
      const items = checkTrackSavedState<App.PlaylistTrackDetail>(
        mutationPayload,
        this.$commit,
      )(this.playlistTracks.items);
      this.playlistTracks = {
        ...this.playlistTracks,
        items,
      };
    };

    // プレイリストをフォロー/アンフォローした後呼ばれる
    const subscribeFollowedPlaylist = (mutationPayload: ExtendedMutationPayload<'playlists/SET_ACTUAL_IS_SAVED'>) => {
      if (this.playlist == null) return;
      const [playlistId, isFollowing] = mutationPayload.payload;
      if (playlistId === this.playlist.id) {
        this.isFollowing = isFollowing;
      }
      this.$commit('playlists/DELETE_ACTUAL_IS_SAVED', playlistId);
    };

    // プレイリストを編集した後呼ばれる
    const subscribeEditedPlaylist = (mutationPayload: ExtendedMutationPayload<'playlists/EDIT_PLAYLIST'>) => {
      if (this.playlist == null) return;
      const {
        id, name, description, isPublic, isCollaborative,
      } = mutationPayload.payload;
      if (id === this.playlist.id) {
        this.playlist = {
          ...this.playlist,
          name: name ?? this.playlist.name,
          // 空文字列の場合は null にする
          description: (description ?? this.playlist.description) || null,
          isPublic: isPublic ?? this.playlist.isPublic,
          isCollaborative: isCollaborative ?? this.playlist.isCollaborative,
        };
      }
    };

    // アイテムを追加した後呼ばれる
    const subscribeAddedItem = async (mutationPayload: ExtendedMutationPayload<'playlists/INCREMENT_UNUPDATED_TRACKS_MAP'>) => {
      if (this.playlist == null || this.playlistTracks == null) return;
      const [playlistId, limit] = mutationPayload.payload;
      const { hasNext } = this.playlistTracks;
      // すべて読み込み済みの表示中のプレイリストにアイテムが追加された場合
      if (playlistId === this.$route.params.playlistId && !hasNext) {
        await this.appendTrackList(limit, { force: true });
        const { playlist } = this;
        this.playlist = {
          ...playlist,
          totalTracks: playlist.totalTracks + limit,
        };
      }
      this.$commit('playlists/DELETE_UNUPDATED_TRACKS_MAP', playlistId);
    };

    // アイテムを削除した後呼ばれる
    const subscribeRemovedItem = (mutationPayload: ExtendedMutationPayload<'playlists/SET_ACTUALLY_DELETED_TRACK'>) => {
      if (this.playlist == null || this.playlistTracks == null) return;

      const [playlistId, { uri, positions: [index] }] = mutationPayload.payload;
      if (playlistId === this.$route.params.playlistId) {
        const currentTracks = this.playlistTracks;
        const removedItem = currentTracks.items[index] as App.PlaylistTrackDetail | undefined;
        if (removedItem == null || removedItem.uri !== uri) return;

        const unmodifiedTrackList = currentTracks.items.slice(0, index);
        // index 番目の要素を除き、残りの後ろの要素のインデックスを変更
        const modifiedTrackList = currentTracks.items
          .slice(index + 1, currentTracks.items.length)
          .map((track) => ({
            ...track,
            index: track.index - 1,
          }));
        this.playlistTracks = {
          ...currentTracks,
          items: [...unmodifiedTrackList, ...modifiedTrackList],
        };
        const currentPlaylist = this.playlist;
        this.playlist = {
          ...currentPlaylist,
          totalTracks: currentPlaylist.totalTracks - 1,
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

  async appendTrackList(counts: number = LIMIT_OF_TRACKS, payload?: { force: true } | undefined) {
    type PagingTracks = SpotifyAPI.Paging<SpotifyAPI.PlaylistTrack>;
    const force = payload?.force ?? false;
    // 強制更新でない場合、すでにトラックがすべて取得されていたら何もしない
    if (this.playlistTracks == null
      || (!force && !this.playlistTracks.hasNext)) return;

    const { playlistId } = this.$route.params;
    const currentTracks = this.playlistTracks;
    const { length } = currentTracks.items;
    const maxLimit = 50;
    const limit = Math.min(counts, maxLimit) as OneToFifty;
    const market = this.$getters()['auth/userCountryCode'];
    const handler = (index: number): Promise<PagingTracks | undefined> => {
      const offset = length + limit * index;
      return this.$spotify.playlists.getPlaylistItems({
        playlistId,
        limit,
        offset,
        market,
      });
    };
    const handlerCounts = Math.ceil(counts / maxLimit);
    const tracks: PagingTracks | undefined = await Promise.all(new Array(handlerCounts)
      .fill(undefined)
      .map((_, i) => handler(i)))
      .then((pagings) => pagings.reduce((prev, curr) => {
        // 1つでもリクエストが失敗したらすべて無効にする
        if (prev == null || curr == null) return undefined;
        return {
          ...curr,
          items: [...prev.items, ...curr.items],
        };
      }, this.$constant.EMPTY_PAGING as PagingTracks));

    const filteredTrackList = (tracks?.items
      .filter(({ track }) => track != null) ?? []) as App.FilteredPlaylistTrack[];
    if (tracks == null || filteredTrackList.length === 0) {
      this.playlistTracks = {
        ...currentTracks,
        hasNext: false,
      };
      return;
    }

    const trackIdList = filteredTrackList.map(({ track }) => track.id);
    // trackIdList の長さが上限を超えるときはプラグイン内で分割してリクエストされる
    const isTrackSavedList = await this.$spotify.library.checkUserSavedTracks({ trackIdList });
    const trackList = filteredTrackList.map(convertPlaylistTrackDetail({
      isTrackSavedList,
      offset: length,
    }));
    this.playlistTracks = {
      ...currentTracks,
      items: [...currentTracks.items, ...trackList],
      hasNext: tracks.next != null,
    };
  }

  onContextMediaButtonClicked(nextPlayingState: OnMediaButton['input']) {
    if (this.playlist == null) return;
    if (nextPlayingState) {
      this.$dispatch('playback/play', this.isPlaylistSet
        ? undefined
        : { contextUri: this.playlist.uri });
    } else {
      this.$dispatch('playback/pause');
    }
  }

  toggleEditPlaylistModal(modal: OnEditModal['input'] | OnMenu['on-edit-menu-clicked']) {
    this.editPlaylistModal = modal;
  }

  toggleFollowingState(nextFollowingState: OnFavoriteButton['input'] | OnMenu['on-follow-menu-clicked']) {
    if (this.playlist == null) return;
    const { isOwnPlaylist } = this.playlist;
    const playlistId = this.playlist?.id;
    if (!nextFollowingState && isOwnPlaylist) {
      // 自分のプレイリストを削除する場合はモーダルで確認
      this.$confirm.open({
        color: 'error',
        text: '削除',
        description: 'プレイリストを削除しますか？',
        onConfirm: async () => {
          if (this.playlist == null || playlistId == null) return;
          await this.$dispatch('playlists/unfollowPlaylist', {
            playlistId,
            isOwnPlaylist: this.playlist.isOwnPlaylist,
          });
        },
      });
      return;
    }
    // API との通信の結果を待たずに先に表示を変更させておく
    this.isFollowing = nextFollowingState;
    if (nextFollowingState) {
      this.$dispatch('playlists/followPlaylist', playlistId);
    } else {
      this.$dispatch('playlists/unfollowPlaylist', {
        playlistId,
        isOwnPlaylist,
      });
    }
  }

  toggleTrackFavoritState({ index, id, isSaved }: OnTable['on-favorite-button-clicked']) {
    if (this.playlistTracks == null) return;

    const currentTracks = this.playlistTracks;
    const nextSavedState = !isSaved;
    // トラックの一覧のお気に入りの状態を変更
    const items = [...currentTracks.items];
    items[index].isSaved = nextSavedState;
    this.playlistTracks = {
      ...currentTracks,
      items,
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
.Fab {
  @include global-fab();
}

.PlaylistIdPage {
  $margin-bottom: 32px;

  @include page-margin();
  @include page-padding();

  &__header {
    @include page-header();

    margin-bottom: $margin-bottom * 0.75;
  }

  &__description {
    @include smaller-than-md() {
      text-align: center;
    }
  }

  &__table {
    margin-bottom: $margin-bottom;
  }
}

.Info {
  @include page-info();

  &__title {
    @include page-title();
  }

  &__footer {
    margin-top: 16px;
    display: flex;

    @include smaller-than-md() {
      flex-direction: column;
    }

    @include larger-than-md() {
      flex-wrap: wrap;
      align-items: flex-end;
    }
  }

  &__buttons {
    @include page-header-buttons(true);
  }

  &__detail {
    // 2行になったとき
    margin-top: 12px;
  }
}
</style>
