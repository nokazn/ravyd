<template>
  <div
    v-if="artistInfo != null"
    :class="$style.ArtistIdPage"
  >
    <portal :to="$header.PORTAL_NAME">
      <div
        v-if="artistInfo != null"
        :class="$style.AdditionalHeaderContent"
      >
        <ContextMediaButton
          :height="32"
          :is-playing="isArtistSet && isPlaying "
          @on-clicked="onContextMediaButtonClicked"
        />

        <FollowButton
          :is-following="isFollowing"
          :height="32"
          @on-clicked="toggleFolloingState"
        />

        <ArtistMenu
          :artist="artistInfo"
          :is-following="isFollowing"
          :size="32"
          outlined
          left
          @on-follow-menu-clicked="toggleFolloingState"
        />
      </div>
    </portal>

    <div
      v-if="artistInfo != null"
      :ref="HEADER_REF"
      :class="$style.ArtistIdPage__header"
    >
      <UserAvatar
        :src="avatarSrc"
        :size="AVATAR_SIZE"
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
              outlined
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

    <template v-for="[type, releaseInfo] in Array.from(releaseListMap.entries())">
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

        <IntersectionLoadingCircle
          v-if="releaseInfo != null && !releaseInfo.isAbbreviated"
          :is-loading="!releaseInfo.isFull"
          :class="$style.CardSection__loadingCircle"
          @on-appeared="appendReleaseList(type)"
        />

        <div
          v-if="releaseInfo.total > ABBREVIATED_RELEASE_LENGTH"
          :class="$style.CardSection__buttonWrapper"
        >
          <ShowAllReleaseButton
            :is-abbreviated="releaseInfo.isAbbreviated"
            @on-clicked="onShowAllButtonClicked(type)"
            @mouseenter.native="onShowAllButtonHovered(type)"
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
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import ShowAllReleaseButton from '~/components/parts/button/ShowAllReleaseButton.vue';

import {
  getReleaseListMap,
  ArtistReleaseInfo,
  getArtistInfo,
  getTopTrackList,
  getIsFollowing,
  initalReleaseListMap,
  ReleaseType,
} from '~/plugins/local/_artistId';
import { checkTrackSavedState } from '~/scripts/subscriber/checkTrackSavedState';
import { convertReleaseForCard } from '~/scripts/converter/convertReleaseForCard';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { App } from '~~/types';

const AVATAR_SIZE = 220;
const ARTWORK_MIN_SIZE = 180;
const ARTWORK_MAX_SIZE = 240;
const ABBREVIATED_TOP_TRACK_LENGTH = 5;
const ABBREVIATED_RELEASE_LENGTH = 10;
const LIMIT_OF_RELEASES = 30;
const HEADER_REF = 'HEADER_REF';

export type AsyncData = {
  artistInfo: App.ArtistInfo | undefined
  isFollowing: boolean
  topTrackList: App.TrackDetail[] | undefined
  releaseListMap: ArtistReleaseInfo
  ABBREVIATED_RELEASE_LENGTH: number
}

export type Data = {
  mutationUnsubscribe: (() => void) | undefined
  HEADER_REF: string
  AVATAR_SIZE: number
  ARTWORK_MIN_SIZE: number
  ARTWORK_MAX_SIZE: number
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
    IntersectionLoadingCircle,
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
      getArtistInfo(context),
      getIsFollowing(context),
      getTopTrackList(context),
      getReleaseListMap(context, ABBREVIATED_RELEASE_LENGTH),
    ] as const);
    return {
      artistInfo,
      isFollowing,
      topTrackList,
      releaseListMap,
      ABBREVIATED_RELEASE_LENGTH,
    };
  },
})
export default class ArtistIdPage extends Vue implements AsyncData, Data {
  artistInfo: App.ArtistInfo | undefined = undefined;
  isFollowing = false;
  topTrackList: App.TrackDetail[] | undefined = undefined;
  releaseListMap: ArtistReleaseInfo = initalReleaseListMap;
  ABBREVIATED_RELEASE_LENGTH = ABBREVIATED_RELEASE_LENGTH;

  mutationUnsubscribe: (() => void) | undefined = undefined;
  HEADER_REF = HEADER_REF;
  ABBREVIATED_TOP_TRACK_LENGTH: typeof ABBREVIATED_TOP_TRACK_LENGTH = ABBREVIATED_TOP_TRACK_LENGTH;
  AVATAR_SIZE = AVATAR_SIZE;
  ARTWORK_MAX_SIZE = ARTWORK_MAX_SIZE;
  ARTWORK_MIN_SIZE = ARTWORK_MIN_SIZE;

  head() {
    return {
      title: this.artistInfo?.name ?? 'エラー',
    };
  }

  get avatarSrc(): string | undefined {
    return getImageSrc(this.artistInfo?.avatarList, AVATAR_SIZE);
  }
  get isArtistSet(): boolean {
    return this.$getters()['player/isContextSet'](this.artistInfo?.uri);
  }
  get isPlaying(): RootState['player']['isPlaying'] {
    return this.$state().player.isPlaying;
  }

  mounted() {
    // ボタンが見えなくなったらヘッダーに表示
    if (this.artistInfo != null) {
      const ref = this.$refs[HEADER_REF] as HTMLDivElement;
      this.$header.observe(ref);
    }

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
    this.$header.disconnectObserver();

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

  async appendReleaseList(type: ReleaseType) {
    const currentReleaseList = this.releaseListMap.get(type);
    // すべて読み込み済みの場合は何もしない
    if (currentReleaseList == null || currentReleaseList.isFull) return;

    this.releaseListMap = new Map(this.releaseListMap.set(type, {
      ...currentReleaseList,
      isAppended: true,
    }).entries());
    const offset = currentReleaseList.items.length;
    const releases = await this.$spotify.artists.getArtistAlbums({
      artistId: this.$route.params.artistId,
      country: this.$getters()['auth/userCountryCode'],
      includeGroupList: [type],
      limit: LIMIT_OF_RELEASES,
      offset,
    });
    const items = releases?.items.map(convertReleaseForCard) ?? [];
    const isFull = releases?.next == null;

    this.releaseListMap = new Map(this.releaseListMap.set(type, {
      ...currentReleaseList,
      items: [...currentReleaseList.items, ...items],
      isFull,
      // currentReleaseList ではまだ isAppended が反映されていないので再度指定する必要がある
      isAppended: true,
    }).entries());
  }

  onShowAllButtonHovered(type: ReleaseType) {
    const currentReleaseList = this.releaseListMap.get(type);
    // すべて取得済みか初回の追加読み込みがなされている場合は何もしない
    if (currentReleaseList == null
      || currentReleaseList.isFull
      || currentReleaseList.isAppended) return;

    this.appendReleaseList(type);
  }

  onShowAllButtonClicked(type: ReleaseType) {
    const currentReleaseList = this.releaseListMap.get(type);
    if (currentReleaseList == null) return;

    // 折りたたむとき
    if (!currentReleaseList.isAbbreviated) {
      this.releaseListMap = new Map(this.releaseListMap.set(type, {
        ...currentReleaseList,
        isAbbreviated: true,
      }).entries());
      return;
    }

    this.releaseListMap = new Map(this.releaseListMap.set(type, {
      ...currentReleaseList,
      isAbbreviated: false,
    }).entries());
    // 初回の追加読み込みがなされていない場合
    if (!currentReleaseList.isAppended) {
      this.appendReleaseList(type);
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
      margin-bottom: -8px;

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

    &__loadingCircle {
      margin-bottom: 16px;
    }

    &__buttonWrapper {
      display: flex;
      justify-content: center;
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
