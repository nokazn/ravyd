<template>
  <div
    :class="$style.ArtistIdPage"
  >
    <div
      v-if="artistInfo != null"
      :class="$style.ArtistIdPage__header"
    >
      <UserAvatar
        :size="AVATAR_SIZE"
        :src="artistInfo.avatarSrc"
        :alt="artistInfo.name"
        :title="artistInfo.name"
        default-user-icon="mdi-account-music"
        shadow
      />

      <div :class="$style.Info">
        <HashTags
          :tag-list="artistInfo.genreList"
          outlined
          :class="$style.Info__hashTags"
        />

        <div>
          <span
            title="認証済アーティスト"
            class="g-small-text"
          >
            アーティスト
          </span>
          <v-icon
            :size="14"
            color="light-blue"
            title="認証済アーティスト"
            :class="$style.Info__verifiedArtistIcon"
          >
            mdi-check-decagram
          </v-icon>
        </div>

        <h1 :class="$style.Info__artistName">
          {{ artistInfo.name }}
        </h1>

        <div :class="$style.Info__footer">
          <p>
            {{ artistInfo.followersText }}
          </p>

          <div :class="$style.Info__buttons">
            <ContextMediaButton
              :is-playing="isArtistSet && isPlaying "
              @on-clicked="onContextMediaButtonClicked"
            />

            <FollowButton
              :is-following="isFollowing"
              @on-clicked="toggleFolloingState"
            />

            <ArtistMenu
              :artist="artistInfo"
              :is-following="isFollowing"
              @on-follow-menu-clicked="toggleFolloingState"
            />
          </div>
        </div>
      </div>
    </div>

    <section v-if="artistInfo != null && topTrackList != null && topTrackList.length > 0">
      <TrackListWrapper
        :abbreviated-length="ABBREVIATED_TOP_TRACK_LENGTH"
        :track-list="topTrackList"
        :uri="artistInfo.uri"
        title="人気の曲"
        :class="$style.ArtistIdPage__trackListSection"
        @on-favorite-button-clicked="onFavoriteTrackButtonClicked"
      />
    </section>

    <template v-for="[type, releaseInfo] in Object.entries(releaseListMap)">
      <CardsSection
        v-if="releaseInfo.items.length > 0"
        :key="type"
        :title="releaseInfo.title"
        :class="$style.CardSection"
      >
        <div :class="$style.CardSection__wrapper">
          <template v-for="(item, index) in releaseInfo.items">
            <ReleaseCard
              v-show="!releaseInfo.isAbbreviated || index < ABBREVIATED_RELEASE_LENGTH"
              :key="item.id"
              v-bind="item"
              :min-width="ARTWORK_MIN_SIZE"
              :max-width="ARTWORK_MAX_SIZE"
              discograpy
              :class="$style.CardSection__card"
            />
          </template>

          <div :class="$style.CradSection__spacer" />
          <div :class="$style.CradSection__spacer" />
          <div :class="$style.CradSection__spacer" />
          <div :class="$style.CradSection__spacer" />
          <div :class="$style.CradSection__spacer" />
          <div :class="$style.CradSection__spacer" />
          <div :class="$style.CradSection__spacer" />
          <div :class="$style.CradSection__spacer" />
        </div>

        <div
          v-if="releaseInfo.total > ABBREVIATED_RELEASE_LENGTH"
          :class="$style.CardSection__buttonWrapper"
        >
          <ShowAllReleaseButton
            :is-abbreviated="releaseInfo.isAbbreviated"
            @on-clicked="onShowAllButtonClicked(type)"
            @mouseenter.native="getAllReleaseList(type)"
          />
        </div>
      </CardsSection>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { RootState, ExtendedMutationPayload } from 'vuex';

import UserAvatar from '~/components/parts/avatar/UserAvatar.vue';
import HashTags from '~/components/parts/chip/HashTags.vue';
import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import FollowButton, { On as OnFollow } from '~/components/parts/button/FollowButton.vue';
import ArtistMenu, { On as OnMenu } from '~/components/containers/menu/ArtistMenu.vue';
import TrackListWrapper, { On as OnList } from '~/components/parts/wrapper/TrackListWrapper.vue';
import CardsSection from '~/components/parts/section/CardsSection.vue';
import ReleaseCard from '~/components/containers/card/ReleaseCard.vue';
import ShowAllReleaseButton from '~/components/parts/button/ShowAllReleaseButton.vue';

import {
  getReleaseListMap,
  ArtistReleaseInfo,
  getArtistInfo,
  getTopTrackList,
  getIsFollowing,
  getReleaseListHandler,
  ReleaseType,
} from '~/scripts/localPlugins/_artistId';
import { checkTrackSavedState } from '~/scripts/subscriber/checkTrackSavedState';
import { App } from '~~/types';

const AVATAR_SIZE = 220;
const TOP_TRACK_ARTWORK_SIZE = 40;
const ARTWORK_MIN_SIZE = 180;
const ARTWORK_MAX_SIZE = 240;
const ABBREVIATED_TOP_TRACK_LENGTH = 5;
const ABBREVIATED_RELEASE_LENGTH = 10;

export type AsyncData = {
  artistInfo: App.ArtistInfo | undefined
  isFollowing: boolean
  topTrackList: App.TrackDetail[] | undefined
  releaseListMap: ArtistReleaseInfo
  getReleaseList: ReturnType<typeof getReleaseListHandler> | undefined
  AVATAR_SIZE: number
  TOP_TRACK_ARTWORK_SIZE: number
  ARTWORK_MIN_SIZE: number
  ARTWORK_MAX_SIZE: number
  ABBREVIATED_RELEASE_LENGTH: number
}

export type Data = {
  mutationUnsubscribe: (() => void) | undefined
  ABBREVIATED_TOP_TRACK_LENGTH: typeof ABBREVIATED_TOP_TRACK_LENGTH
}

@Component({
  components: {
    UserAvatar,
    HashTags,
    ContextMediaButton,
    FollowButton,
    ArtistMenu,
    TrackListWrapper,
    CardsSection,
    ReleaseCard,
    ShowAllReleaseButton,
  },

  validate({ params }: Context) {
    return params.artistId !== '';
  },

  async asyncData(context): Promise<AsyncData> {
    const [
      artistInfo,
      isFollowing,
      topTrackList,
      releaseListMap,
    ] = await Promise.all([
      getArtistInfo(context, AVATAR_SIZE),
      getIsFollowing(context),
      getTopTrackList(context, TOP_TRACK_ARTWORK_SIZE),
      getReleaseListMap(context, ARTWORK_MAX_SIZE, ABBREVIATED_RELEASE_LENGTH),
    ] as const);
    const getReleaseList = getReleaseListHandler(context);

    return {
      artistInfo,
      isFollowing,
      topTrackList,
      releaseListMap,
      getReleaseList,
      AVATAR_SIZE,
      TOP_TRACK_ARTWORK_SIZE,
      ARTWORK_MIN_SIZE,
      ARTWORK_MAX_SIZE,
      ABBREVIATED_RELEASE_LENGTH,
    };
  },
})
export default class ArtistIdPage extends Vue implements AsyncData, Data {
  artistInfo: App.ArtistInfo | undefined = undefined;
  isFollowing = false;
  topTrackList: App.TrackDetail[] | undefined = undefined;
  releaseListMap: ArtistReleaseInfo = {
    album: {
      title: 'アルバム',
      items: [],
      total: 0,
      isFull: false,
      isAbbreviated: true,
      isFetching: false,
    },
    single: {
      title: 'シングル・EP',
      items: [],
      total: 0,
      isFull: false,
      isAbbreviated: true,
      isFetching: false,
    },
    compilation: {
      title: 'コンピレーション',
      items: [],
      total: 0,
      isFull: false,
      isAbbreviated: true,
      isFetching: false,
    },
    appears_on: {
      title: '参加作品',
      items: [],
      total: 0,
      isFull: false,
      isAbbreviated: true,
      isFetching: false,
    },
  };
  getReleaseList: ReturnType<typeof getReleaseListHandler> | undefined = undefined

  AVATAR_SIZE = AVATAR_SIZE;
  TOP_TRACK_ARTWORK_SIZE = TOP_TRACK_ARTWORK_SIZE;
  ARTWORK_MAX_SIZE = ARTWORK_MAX_SIZE;
  ARTWORK_MIN_SIZE = ARTWORK_MIN_SIZE;
  ABBREVIATED_RELEASE_LENGTH = ABBREVIATED_RELEASE_LENGTH;

  mutationUnsubscribe: (() => void) | undefined = undefined;
  ABBREVIATED_TOP_TRACK_LENGTH: typeof ABBREVIATED_TOP_TRACK_LENGTH = ABBREVIATED_TOP_TRACK_LENGTH;

  head() {
    return {
      title: this.artistInfo?.name ?? 'エラー',
    };
  }

  get isArtistSet(): boolean {
    return this.$getters()['player/isContextSet'](this.artistInfo?.uri);
  }
  get isPlaying(): RootState['player']['isPlaying'] {
    return this.$state().player.isPlaying;
  }

  mounted() {
    this.$dispatch('setDefaultDominantBackgroundColor');

    // トラックを保存/削除した後呼ばれる
    const subscribeTrack = (mutationPayload: ExtendedMutationPayload<'library/tracks/SET_ACTUAL_IS_SAVED'>) => {
      if (this.topTrackList == null) return;

      const trackList = checkTrackSavedState<App.TrackDetail>(
        mutationPayload,
        this.$commit,
      )(this.topTrackList);

      this.topTrackList = trackList;
    };

    // アーティストを編集した後呼ばれる
    const subscribeArtist = (mutationPayload: ExtendedMutationPayload<'library/artists/SET_ACTUAL_IS_SAVED'>) => {
      if (this.artistInfo == null) return;

      const [artistId, isFollowing] = mutationPayload.payload;
      if (artistId === this.artistInfo.id) {
        this.isFollowing = isFollowing;
        this.$commit('library/artists/DELETE_ACTUAL_IS_SAVED', artistId);
      }
    };

    this.mutationUnsubscribe = this.$subscribe((mutation) => {
      const { type } = mutation;
      switch (type) {
        case 'library/tracks/SET_ACTUAL_IS_SAVED':
          subscribeTrack(mutation as ExtendedMutationPayload<typeof type>);
          break;
        case 'library/artists/SET_ACTUAL_IS_SAVED':
          subscribeArtist(mutation as ExtendedMutationPayload<typeof type>);
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

  onContextMediaButtonClicked(nextPlayingState: OnMediaButton['on-clicked']) {
    if (this.artistInfo == null) return;

    if (nextPlayingState) {
      this.$dispatch('player/play', this.isArtistSet
        ? undefined
        : { contextUri: this.artistInfo.uri });
    } else {
      this.$dispatch('player/pause');
    }
  }

  toggleFolloingState(nextFollowingState: OnFollow['on-clicked'] | OnMenu['on-follow-menu-clicked']) {
    if (this.artistInfo == null) return;

    // API との通信の結果を待たずに先に表示を変更させておく
    this.isFollowing = nextFollowingState;

    const artistIdList = [this.artistInfo.id];
    if (nextFollowingState) {
      this.$dispatch('library/artists/followArtists', artistIdList);
    } else {
      this.$dispatch('library/artists/unfollowArtists', artistIdList);
    }
  }

  onFavoriteTrackButtonClicked({ index, id, isSaved }: OnList['on-favorite-button-clicked']) {
    if (this.topTrackList == null) return;

    const nextSavedState = !isSaved;
    const topTrackList = [...this.topTrackList];
    topTrackList[index].isSaved = nextSavedState;
    this.topTrackList = topTrackList;

    if (nextSavedState) {
      this.$dispatch('library/tracks/saveTracks', [id]);
    } else {
      this.$dispatch('library/tracks/removeTracks', [id]);
    }
  }

  async getAllReleaseList(type: ReleaseType) {
    const currentReleaseList = this.releaseListMap[type];
    // すでにすべて表示されてるか取得済みの場合は何もしない
    if (!currentReleaseList.isAbbreviated
      || currentReleaseList.isFull
      || currentReleaseList == null
      || typeof this.getReleaseList !== 'function') return;

    const offset = currentReleaseList.items.length;
    const counts = currentReleaseList.total - offset;
    // 追加で取得するコンテンツがあり、取得中でない場合
    if (counts > 0 && !currentReleaseList.isFetching) {
      this.$set(this.releaseListMap[type], 'isFetching', true);
      const releaseList = await this.getReleaseList({
        type,
        artworkSize: this.ARTWORK_MAX_SIZE,
        counts,
        offset,
      });

      this.$set(this.releaseListMap[type], 'items', [...currentReleaseList.items, ...releaseList]);
      this.$set(this.releaseListMap[type], 'isFull', true);
      this.$set(this.releaseListMap[type], 'isFetching', false);
    }
  }

  async onShowAllButtonClicked(type: ReleaseType) {
    const currentReleaseList = this.releaseListMap[type];
    if (currentReleaseList == null || typeof this.getReleaseList !== 'function') return;

    if (currentReleaseList.isAbbreviated) {
      await this.getAllReleaseList(type);
      this.$set(this.releaseListMap[type], 'isAbbreviated', false);
    } else {
      this.$set(this.releaseListMap[type], 'isAbbreviated', true);
    }
  }
}
</script>

<style lang="scss" module>
.ArtistIdPage {
  padding: 16px 6% 48px;

  &__header {
    display: grid;
    grid-template-columns: 220px auto;
    grid-column-gap: 24px;
    margin-bottom: 32px;
  }

  &__trackListSection {
    margin-bottom: 32px;
  }

  .CardSection {
    &:not(:last-child) {
      margin-bottom: 16px;
    }

    &__wrapper {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;

      // card と spacer 両方に適用
      & > * {
        margin-left: 16px;
        margin-right: 16px;
        flex: 1 0 180px;
        min-width: 180px;
        max-width: 240px;
      }
    }

    &__card {
      margin-bottom: 32px;
    }

    // 最終行の余りの部分を埋める
    &__spacer {
      height: 0;
    }

    &__buttonWrapper {
      margin-top: -8px;
      display: flex;
      justify-content: center;
    }

    &__buttonIcon {
      margin-right: 4px;
    }
  }

  .Info {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    &__hashTags {
      // border-radius の分だけ右にあるように見えてしまうので調整
      margin-left: -8px;
      margin-bottom: 12px;
    }

    &__verifiedArtistIcon {
      margin-bottom: 2px;
    }

    &__artistName {
      font-size: 40px;
      margin: 8px 0;
      line-height: 1.2em;
    }

    &__buttons {
      display: flex;
      flex-wrap: nowrap;

      & > *:not(:last-child) {
        margin-right: 12px;
      }
    }
  }
}
</style>
