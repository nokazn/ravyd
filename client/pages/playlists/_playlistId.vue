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
          fab
          :disabled="!hasTracks"
          :value="isPlaylistSet && isPlaying"
          @input="onContextMediaButtonClicked"
        />

        <CircleButton
          v-if="playlistInfo.isOwnPlaylist"
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
          :playlist="playlistInfo"
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
        :alt="playlistInfo.name"
        :title="playlistInfo.name"
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

        <h1 :class="$style.Info__title">
          {{ playlistInfo.name }}
        </h1>

        <div>
          <UserName
            avatar
            :user="playlistInfo.owner"
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
              v-if="playlistInfo.isOwnPlaylist"
              outlined
              title="編集する"
              :size="36"
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
              :playlist="playlistInfo"
              :following="isFollowing"
              @on-edit-menu-clicked="toggleEditPlaylistModal(true)"
              @on-follow-menu-clicked="toggleFollowingState"
            />
          </div>

          <PlaylistDetailWrapper
            :playlist="playlistInfo"
            :class="$style.Info__detail"
          />
        </div>
      </div>
    </div>

    <EditPlaylistModal
      v-model="editPlaylistModal"
      :form="editPlaylistForm"
    />

    <ConfirmModal
      v-model="confirmModal"
      :loading="confirmModalParams.loading"
      :type="confirmModalParams.type"
      :color="confirmModalParams.color"
      :text="confirmModalParams.text"
      @on-confirmed="onConfirmed"
    >
      {{ confirmModalParams.description }}
    </ConfirmModal>

    <p
      v-if="playlistInfo.description"
      class="subtext--text"
      :class="$style.PlaylistIdPage__description"
      v-html="playlistInfo.description"
    />

    <template v-if="playlistTrackInfo != null">
      <PlaylistTrackTable
        :tracks="playlistTrackInfo.trackList"
        :playlist-id="playlistInfo.isOwnPlaylist ? playlistInfo.id : undefined"
        :uri="playlistInfo.uri"
        :class="$style.PlaylistIdPage__table"
        @on-favorite-button-clicked="toggleTrackFavoritState"
      />

      <IntersectionLoadingCircle
        :loading="!playlistTrackInfo.isFullTrackList"
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
import EditPlaylistModal, { On as OnEditModal, Form } from '~/components/parts/modal/EditPlaylistModal.vue';
import ConfirmModal, { On as OnConfirmModal } from '~/components/parts/modal/ConfirmModal.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import Fallback from '~/components/parts/others/Fallback.vue';

import { getPlaylistInfo, getIsFollowing, getPlaylistTrackInfo } from '~/services/local/_playlistId';
import { convertPlaylistTrackDetail } from '~/utils/converter';
import { getImageSrc } from '~/utils/image';
import { checkTrackSavedState } from '~/utils/subscriber';
import type { ToastType } from '~/plugins/observable/toast';
import type { App, OneToFifty, SpotifyAPI } from '~~/types';

const LIMIT_OF_TRACKS = 30;
const HEADER_REF = 'HEADER_REF';
const REMOVE_PLAYLIST_MODAL = 'REMOVE_PLAYLIST_MODAL';

type Modal = {
  value: boolean;
  loading: boolean;
  type: string;
  color: ToastType | undefined;
  text: string;
  description: string;
}

interface AsyncData {
  playlistInfo: App.PlaylistInfo | undefined;
  isFollowing: boolean;
  playlistTrackInfo: App.PlaylistTrackInfo | undefined;
}

interface Data {
  editPlaylistModal: boolean;
  confirmModalParams: Modal;
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
    ConfirmModal,
    IntersectionLoadingCircle,
    Fallback,
  },

  validate({ params }) {
    return params.playlistId != null && params.playlistId !== '';
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
    ] as const);

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
  confirmModalParams: Modal = {
    value: false,
    loading: false,
    type: '',
    color: undefined,
    text: '',
    description: '',
  };
  mutationUnsubscribe: (() => void) | undefined = undefined;
  HEADER_REF = HEADER_REF;

  head() {
    return {
      title: this.playlistInfo?.name ?? 'エラー',
    };
  }

  get confirmModal(): boolean {
    return this.confirmModalParams.value;
  }
  set confirmModal(value: OnConfirmModal['input']) {
    this.toggleConfirmModal(value);
  }

  get artworkSrc(): string | undefined {
    return getImageSrc(this.playlistInfo?.images, this.$constant.ARTWORK_BASE_SIZE);
  }
  get isPlaylistSet(): boolean {
    return this.$getters()['playback/isContextSet'](this.playlistInfo?.uri);
  }
  get isPlaying(): RootState['playback']['isPlaying'] {
    return this.$state().playback.isPlaying;
  }
  get hasTracks(): boolean {
    return this.playlistTrackInfo != null
      ? this.playlistTrackInfo.trackList.length > 0
      : false;
  }
  get editPlaylistForm(): Form | undefined {
    if (this.playlistInfo == null) return undefined;

    const {
      name, description, images, isPublic, isCollaborative,
    } = this.playlistInfo;

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
    if (this.playlistInfo != null) {
      const ref = this.$refs[HEADER_REF] as HTMLDivElement;
      this.$header.observe(ref);
    }

    // 小さい画像から抽出
    const artworkSrc = getImageSrc(this.playlistInfo?.images, 40);
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
      if (playlistId === this.$route.params.playlistId && isFullTrackList) {
        await this.appendTrackList(limit, { force: true });
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

  async appendTrackList(counts: number = LIMIT_OF_TRACKS, payload?: { force: true } | undefined) {
    type PagingTracks = SpotifyAPI.Paging<SpotifyAPI.PlaylistTrack>;
    const force = payload?.force ?? false;
    // 強制更新出ない場合、すでにトラックがすべて取得されていたら何もしない
    if (this.playlistTrackInfo == null
      || (!force && this.playlistTrackInfo.isFullTrackList)) return;

    const { playlistId } = this.$route.params;
    const currentPlaylistTrackInfo = this.playlistTrackInfo;
    const { length } = currentPlaylistTrackInfo.trackList;
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
    // trackIdList の長さが上限を超えるときはプラグイン内で分割してリクエストされる
    const isTrackSavedList = await this.$spotify.library.checkUserSavedTracks({ trackIdList });
    const trackList = filteredTrackList.map(convertPlaylistTrackDetail({
      isTrackSavedList,
      offset: length,
    }));
    const isFullTrackList = tracks.next == null;

    this.playlistTrackInfo = {
      ...currentPlaylistTrackInfo,
      trackList: [...currentPlaylistTrackInfo.trackList, ...trackList],
      isFullTrackList,
    };
  }

  onContextMediaButtonClicked(nextPlayingState: OnMediaButton['input']) {
    if (this.playlistInfo == null) return;

    if (nextPlayingState) {
      this.$dispatch('playback/play', this.isPlaylistSet
        ? undefined
        : { contextUri: this.playlistInfo.uri });
    } else {
      this.$dispatch('playback/pause');
    }
  }

  toggleEditPlaylistModal(modal: OnEditModal['input'] | OnMenu['on-edit-menu-clicked']) {
    this.editPlaylistModal = modal;
  }

  toggleConfirmModal(value: OnConfirmModal['input'], params?: Partial<Omit<Modal, 'value'>>) {
    const { confirmModalParams } = this;
    this.confirmModalParams = params != null
      ? { ...confirmModalParams, value, ...params }
      : { ...confirmModalParams, value };
  }

  toggleConfirmModalLoading(loading: boolean) {
    const { confirmModalParams } = this;
    this.confirmModalParams = { ...confirmModalParams, loading };
  }

  toggleFollowingState(nextFollowingState: OnFavoriteButton['input'] | OnMenu['on-follow-menu-clicked']) {
    if (this.playlistInfo == null) return;

    const { isOwnPlaylist } = this.playlistInfo;
    if (!nextFollowingState && isOwnPlaylist) {
      // 自分のプレイリストを削除する場合はモーダルで確認
      this.toggleConfirmModal(true, {
        type: REMOVE_PLAYLIST_MODAL,
        color: 'error',
        text: '削除',
        description: 'プレイリストを削除しますか？',
      });
      return;
    }

    // API との通信の結果を待たずに先に表示を変更させておく
    this.isFollowing = nextFollowingState;
    const playlistId = this.playlistInfo.id;
    if (nextFollowingState) {
      this.$dispatch('playlists/followPlaylist', playlistId);
    } else {
      this.$dispatch('playlists/unfollowPlaylist', {
        playlistId,
        isOwnPlaylist,
      });
    }
  }

  onConfirmed(type: OnConfirmModal['on-confirmed']) {
    const removePlaylist = () => {
      const playlistId = this.playlistInfo?.id;
      if (this.playlistInfo == null || playlistId == null) return;

      this.toggleConfirmModalLoading(true);
      this.$dispatch('playlists/unfollowPlaylist', {
        playlistId,
        isOwnPlaylist: this.playlistInfo.isOwnPlaylist,
      }).then(() => {
        this.toggleConfirmModal(false);
      }).finally(() => {
        this.toggleConfirmModalLoading(false);
      });
    };

    switch (type) {
      case REMOVE_PLAYLIST_MODAL:
        removePlaylist();
        break;
      default:
        break;
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
  @include additional-header-content();
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
