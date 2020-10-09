<template>
  <div
    v-if="artistInfo != null"
    :class="$style.ArtistIdTopPage"
  >
    <div
      :class="{
        [$style.TopContent]: true,
        [$style['TopContent--twoColumns']]: relatedArtistList.length > 0,
      }"
    >
      <TrackListSection
        v-if="topTrackList.length > 0"
        title="人気の曲"
        :value="isFirstSectionAbbreviated"
        @input="toggleAbbreviatedTrackList"
      >
        <TrackList
          :tracks="topTrackList"
          :length="abbreviatedTopTrackLength"
          :uri="artistInfo.uri"
          @on-favorite-button-clicked="onFavoriteTrackButtonClicked"
        />
      </TrackListSection>

      <ContentListSection
        v-if="relatedArtistList.length > 0"
        title="関連アーティスト"
        :items="relatedArtistList"
        :length="abbreviatedRelatedArtistLength"
      />
    </div>

    <template v-for="[type, releaseInfo] in Array.from(releaseListMap.entries())">
      <CardsSection
        v-if="releaseInfo.items.length > 0"
        :key="type"
        :title="releaseInfo.title"
        :full="releaseInfo.isFull"
        :value="releaseInfo.isAbbreviated"
        :class="$style.DiscographySection"
        @input="onShowAllButtonClicked(type)"
        @on-button-hovered="onShowAllButtonHovered(type)"
        @on-loading-appeared="appendReleaseList(type)"
      >
        <ReleaseCard
          v-for="(item, index) in releaseInfo.items"
          v-show="!releaseInfo.isAbbreviated || index < ABBREVIATED_RELEASE_LENGTH"
          :key="item.id"
          v-bind="item"
          :min-width="$constant.FLEX_CARD_MIN_WIDTH"
          :max-width="$constant.FLEX_CARD_MAX_WIDTH"
          discograpy
          :class="$style.CardSection__card"
        />
      </CardsSection>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { ExtendedMutationPayload } from 'typed-vuex';

import TrackListSection, { On as OnListSection } from '~/components/parts/section/TrackListSection.vue';
import TrackList, { On as OnList } from '~/components/containers/list/TrackList.vue';
import ContentListSection from '~/components/parts/section/ContentListSection.vue';
import CardsSection from '~/components/parts/section/CardsSection.vue';
import ReleaseCard from '~/components/containers/card/ReleaseCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';

import { getReleaseListMap, getTopTrackList, initalReleaseListMap } from '~/services/local/_artistId';
import { checkTrackSavedState } from '~/utils/subscriber';
import { convertReleaseForCard } from '~/utils/converter';
import type { ArtistReleaseInfo, ReleaseType } from '~/services/local/_artistId';
import type { App } from '~~/types';

const ABBREVIATED_TOP_TRACK_LENGTH = 5;
const FULL_TOP_TRACK_LENGTH = 10;
const ABBREVIATED_RELATED_ARTIST_LENGTH = 10;
const ABBREVIATED_RELEASE_LENGTH = 12;
const LIMIT_OF_RELEASES = 30;

type TabItem = {
  title: string
  to: string
}

interface AsyncData {
  topTrackList: App.TrackDetail[]
  releaseListMap: ArtistReleaseInfo
  ABBREVIATED_RELEASE_LENGTH: number
}

interface Data {
  isTrackListAbbreviated: boolean | undefined
  mutationUnsubscribe: (() => void) | undefined
}

@Component({
  components: {
    TrackListSection,
    TrackList,
    ContentListSection,
    CardsSection,
    ReleaseCard,
    IntersectionLoadingCircle,
  },

  validate({ params }: Context) {
    return params.artistId != null && params.artistId !== '';
  },

  async asyncData(context): Promise<AsyncData> {
    const [
      topTrackList,
      releaseListMap,
    ] = await Promise.all([
      getTopTrackList(context),
      getReleaseListMap(context, ABBREVIATED_RELEASE_LENGTH),
    ] as const);
    return {
      topTrackList,
      releaseListMap,
      ABBREVIATED_RELEASE_LENGTH,
    };
  },
})
export default class ArtistIdTopPage extends Vue implements AsyncData, Data {
  @Prop([Object])
  artistInfo!: App.ArtistInfo;

  @Prop([Array])
  relatedArtistList!: App.ContentItemInfo<'artist'>[];

  topTrackList: App.TrackDetail[] = [];
  releaseListMap: ArtistReleaseInfo = initalReleaseListMap;
  ABBREVIATED_RELEASE_LENGTH = ABBREVIATED_RELEASE_LENGTH;

  isTrackListAbbreviated = true;
  mutationUnsubscribe: (() => void) | undefined = undefined;

  get isFirstSectionAbbreviated(): boolean | undefined {
    return this.topTrackList.length > ABBREVIATED_TOP_TRACK_LENGTH
      ? this.isTrackListAbbreviated
      : undefined;
  }
  get abbreviatedTopTrackLength(): number | undefined {
    return this.isFirstSectionAbbreviated == null || this.isFirstSectionAbbreviated
      ? ABBREVIATED_TOP_TRACK_LENGTH
      : FULL_TOP_TRACK_LENGTH;
  }
  get abbreviatedRelatedArtistLength(): number | undefined {
    return this.isFirstSectionAbbreviated == null || this.isFirstSectionAbbreviated
      ? ABBREVIATED_TOP_TRACK_LENGTH
      : ABBREVIATED_RELATED_ARTIST_LENGTH;
  }

  mounted() {
    // トラックを保存/削除した後呼ばれる
    const subscribeTrack = (mutationPayload: ExtendedMutationPayload<'library/tracks/SET_ACTUAL_IS_SAVED'>) => {
      const trackList = checkTrackSavedState<App.TrackDetail>(
        mutationPayload,
        this.$commit,
      )(this.topTrackList);

      this.topTrackList = trackList;
    };

    this.mutationUnsubscribe = this.$subscribe((mutation) => {
      const { type } = mutation;
      switch (type) {
        case 'library/tracks/SET_ACTUAL_IS_SAVED':
          subscribeTrack(mutation as ExtendedMutationPayload<typeof type>);
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

  toggleAbbreviatedTrackList(nextIsAbbreviated: OnListSection['input']) {
    this.isTrackListAbbreviated = nextIsAbbreviated;
    // TrackListItem の高さに影響
    const itemHeight = 52;
    const aditionalListItems = FULL_TOP_TRACK_LENGTH - ABBREVIATED_TOP_TRACK_LENGTH;
    // DOMを更新した後に表示し多分スクロールする
    this.$nextTick().then(() => {
      window.scrollBy({
        top: itemHeight * aditionalListItems * (nextIsAbbreviated ? -1 : 1),
        behavior: 'smooth',
      });
    });
  }

  onFavoriteTrackButtonClicked({ index, id, isSaved }: OnList['on-favorite-button-clicked']) {
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
.ArtistIdTopPage {
  $margin-bottom: 24px;

  .TopContent {
    margin-top: $margin-bottom;

    & > * {
      margin-bottom: $margin-bottom;
    }

    &--twoColumns {
      $column-gap: max(4%, 20px);

      @include larger-than-md() {
        $related-artists-width: 220px;
        $top-tracks-width: calc(100% - #{$related-artists-width} - #{$column-gap});

        display: grid;
        grid-template-columns: $top-tracks-width $related-artists-width;
        column-gap: $column-gap;
      }

      @include larger-than-xl() {
        $related-artists-width: 300px;
        $top-tracks-width: calc(100% - #{$related-artists-width} - #{$column-gap});

        grid-template-columns: $top-tracks-width $related-artists-width;
      }
    }
  }

  .DiscographySection {
    margin-bottom: $margin-bottom;
  }
}
</style>
