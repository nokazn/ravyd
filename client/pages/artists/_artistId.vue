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
          fab
          :value="isArtistSet && isPlaying "
          @input="onContextMediaButtonClicked"
        />
        <FavoriteButton
          text="フォロー"
          :fab="$screen.isSingleColumn"
          :outlined="$screen.isMultiColumn"
          :value="isFollowing"
          @input="toggleFollowingState"
        />
        <ArtistMenu
          left
          :fab="$screen.isSingleColumn"
          :outlined="$screen.isMultiColumn"
          :artist="artistInfo"
          :following="isFollowing"
          @on-follow-menu-clicked="toggleFollowingState"
        />
      </div>
    </portal>

    <div
      :ref="HEADER_REF"
      :class="$style.ArtistIdPage__header"
    >
      <UserAvatar
        shadow
        type="artist"
        :src="avatarSrc"
        :size="$screen.artworkSize"
        :alt="artistInfo.name"
        :title="artistInfo.name"
      />

      <div :class="$style.Info">
        <HashTags
          outlined
          :tags="artistInfo.genreList"
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
            color="light-blue"
            title="認証済アーティスト"
            :size="14"
            :class="$style.Info__verifiedArtistIcon"
          >
            mdi-check-decagram
          </v-icon>
        </div>

        <h1 :class="$style.Info__title">
          {{ artistInfo.name }}
        </h1>

        <p
          class="subtext--text"
          :class="$style.Info__followers"
        >
          {{ artistInfo.followersText }}
        </p>

        <div :class="$style.Info__buttons">
          <ContextMediaButton
            :value="isArtistSet && isPlaying "
            @input="onContextMediaButtonClicked"
          />

          <FavoriteButton
            v-if="$screen.isSingleColumn"
            outlined
            text="フォロー"
            :value="isFollowing"
            @input="toggleFollowingState"
          />
          <FollowButton
            v-else-if="$screen.isMultiColumn"
            :value="isFollowing"
            @input="toggleFollowingState"
          />

          <ArtistMenu
            outlined
            :artist="artistInfo"
            :following="isFollowing"
            @on-follow-menu-clicked="toggleFollowingState"
          />
        </div>
      </div>
    </div>

    <v-tabs
      v-model="tab"
      color="active"
      background-color="transparent"
      :height="32"
      :show-arrows="false"
    >
      <v-tab
        v-for="item in tabItemList"
        :key="item.title"
        nuxt
        :to="item.to"
      >
        <span :class="subtextColor(item)">
          {{ item.title }}
        </span>
      </v-tab>
    </v-tabs>

    <nuxt-child
      keep-alive
      :artist-info="artistInfo"
      :related-artist-list="relatedArtistList"
    />
  </div>

  <Fallback v-else>
    アーティストの情報を取得できませんでした。
  </Fallback>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { RootState, ExtendedMutationPayload } from 'typed-vuex';

import UserAvatar from '~/components/parts/image/UserAvatar.vue';
import HashTags from '~/components/parts/chip/HashTags.vue';
import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import FollowButton, { On as OnFollow } from '~/components/parts/button/FollowButton.vue';
import FavoriteButton, { On as OnFavorite } from '~/components/parts/button/FavoriteButton.vue';
import ArtistMenu, { On as OnMenu } from '~/components/parts/menu/ArtistMenu.vue';
import Fallback from '~/components/parts/others/Fallback.vue';

import { subtextColorClass } from '~/utils/text';
import {
  getArtistInfo,
  getIsFollowing,
  getRelatedArtistList,
} from '~/services/local/_artistId';
import { getImageSrc } from '~/utils/image';
import { App } from '~~/types';

const HEADER_REF = 'HEADER_REF';

type TabItem = {
  title: string;
  to: string;
}

interface AsyncData {
  artistInfo: App.ArtistInfo | undefined;
  isFollowing: boolean;
  relatedArtistList: App.ContentItemInfo<'artist'>[];
}

interface Data {
  tab: number | null;
  mutationUnsubscribe: (() => void) | undefined
  HEADER_REF: string;
}

@Component({
  components: {
    UserAvatar,
    HashTags,
    ContextMediaButton,
    FavoriteButton,
    FollowButton,
    ArtistMenu,
    Fallback,
  },

  validate({ params }: Context) {
    return params.artistId != null && params.artistId !== '';
  },

  async asyncData(context): Promise<AsyncData> {
    const [
      artistInfo,
      isFollowing,
      relatedArtistList,
    ] = await Promise.all([
      getArtistInfo(context),
      getIsFollowing(context),
      getRelatedArtistList(context),
    ] as const);
    return {
      artistInfo,
      isFollowing,
      relatedArtistList,
    };
  },

  scrollToTop: true,
})
export default class ArtistIdPage extends Vue implements AsyncData, Data {
  artistInfo: App.ArtistInfo | undefined = undefined;
  isFollowing = false;
  relatedArtistList: App.ContentItemInfo<'artist'>[] = [];

  tab: number | null = null;
  mutationUnsubscribe: (() => void) | undefined = undefined;
  HEADER_REF = HEADER_REF;

  head() {
    return {
      title: this.artistInfo?.name ?? 'エラー',
    };
  }

  get avatarSrc(): string | undefined {
    return getImageSrc(this.artistInfo?.images, this.$constant.ARTWORK_BASE_SIZE);
  }
  get isArtistSet(): boolean {
    return this.$getters()['playback/isContextSet'](this.artistInfo?.uri);
  }
  get isPlaying(): RootState['playback']['isPlaying'] {
    return this.$state().playback.isPlaying;
  }
  get tabItemList(): TabItem[] {
    const { artistId } = this.$route.params;
    const { length } = this.relatedArtistList;
    const top = {
      title: 'トップ',
      to: `/artists/${artistId}`,
    };
    const relatedArtist = {
      title: '関連アーティスト',
      to: `/artists/${artistId}/related`,
    };
    return length > 0
      ? [top, relatedArtist]
      : [top];
  }
  get subtextColor() {
    return (item: TabItem) => subtextColorClass(this.$route.fullPath === item.to);
  }

  mounted() {
    // ボタンが見えなくなったらヘッダーに表示
    if (this.artistInfo != null) {
      const ref = this.$refs[HEADER_REF] as HTMLDivElement;
      this.$header.observe(ref);
    }

    this.$dispatch('setDefaultDominantBackgroundColor');

    // アーティストをフォロー/アンフォローした後呼ばれる
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

  onContextMediaButtonClicked(nextPlayingState: OnMediaButton['input']) {
    if (this.artistInfo == null) return;

    if (nextPlayingState) {
      this.$dispatch('playback/play', this.isArtistSet
        ? undefined
        : { contextUri: this.artistInfo.uri });
    } else {
      this.$dispatch('playback/pause');
    }
  }

  toggleFollowingState(nextFollowingState: OnFollow['input'] | OnFavorite['input'] | OnMenu['on-follow-menu-clicked']) {
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
}
</script>

<style lang="scss" module>
.AdditionalHeaderContent {
  @include additional-header-content();
}

.ArtistIdPage {
  @include page-margin();
  @include page-padding();

  &__header {
    @include page-header();

    margin-bottom: 16px;
  }
}

.Info {
  @include page-info();

  &__hashTags {
    margin-bottom: 12px;

    @include smaller-than-md() {
      // 1個だけはみ出て2列になったりするとちょっと不格好なのであまり横に広がりすぎないようにする
      padding: 0 4vw;
      justify-content: center;
    }

    @include larger-than-md() {
      // border-radius の分だけ右にあるように見えてしまうので調整
      margin-left: -8px;
    }
  }

  &__verifiedArtistIcon {
    margin-bottom: 0.15rem;
  }

  &__title {
    @include page-title();
  }

  &__followers {
    @include smaller-than-md() {
      text-align: center;
    }
  }

  &__buttons {
    @include page-header-buttons();
  }
}
</style>
