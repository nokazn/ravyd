<template>
  <div
    v-if="artist != null"
    :class="$style.ArtistIdPage"
  >
    <portal :to="$header.PORTAL_NAME">
      <div
        v-if="artist != null"
        :class="$style.Fab"
      >
        <ContextMediaButton
          :fab="!$screen.isSp"
          :value="isArtistSet && isPlaying "
          @input="onContextMediaButtonClicked"
        />
        <FavoriteButton
          text="フォロー"
          :fab="$screen.isSp"
          :outlined="!$screen.isSp"
          :value="isFollowing"
          @input="toggleFollowingState"
        />
        <ArtistMenu
          left
          :fab="$screen.isSp"
          :outlined="!$screen.isSp"
          :artist="artist"
          :following="isFollowing"
          @on-follow-menu-clicked="toggleFollowingState"
        />
      </div>
    </portal>

    <div
      :ref="HEADER_REF"
      :class="$style.ArtistIdPage__header"
    >
      <Avatar
        shadow
        type="artist"
        :src="avatarSrc"
        :size="$screen.artworkSize"
        :alt="artist.name"
        :title="artist.name"
      />

      <div :class="$style.Info">
        <HashTags
          outlined
          :tags="artist.genreList"
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
          {{ artist.name }}
        </h1>

        <p
          class="subtext--text"
          :class="$style.Info__followers"
        >
          <Followers :followers="artist.followers" />
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
            :artist="artist"
            :following="isFollowing"
            :left="$screen.isSingleColumn"
            :right="$screen.isMultiColumn"
            @on-follow-menu-clicked="toggleFollowingState"
          />
        </div>
      </div>
    </div>

    <Tabs
      transparent
      :divider="isRelatedPage"
      :items="tabs"
      :class="$style.ArtistIdPage__tabs"
    />

    <nuxt-child
      keep-alive
      :artist="artist"
      :related-artists="relatedArtistList"
    />
  </div>

  <Fallback v-else>
    アーティストの情報を取得できませんでした。
  </Fallback>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import type { Context } from '@nuxt/types';
import { RootState, ExtendedMutationPayload } from 'typed-vuex';

import Avatar from '~/components/parts/image/Avatar.vue';
import HashTags from '~/components/parts/chip/HashTags.vue';
import Followers from '~/components/parts/text/Followers.vue';
import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import FollowButton, { On as OnFollow } from '~/components/parts/button/FollowButton.vue';
import FavoriteButton, { On as OnFavorite } from '~/components/parts/button/FavoriteButton.vue';
import ArtistMenu, { On as OnMenu } from '~/components/parts/menu/ArtistMenu.vue';
import Tabs, { Item } from '~/components/parts/tab/Tabs.vue';
import Fallback from '~/components/parts/utils/Fallback.vue';

import {
  getArtist,
  getIsFollowing,
  getRelatedArtistList,
} from '~/services/local/_artistId';
import { getImageSrc } from '~/services/converter';
import type { App } from '~/entities';

const HEADER_REF = 'HEADER_REF';

interface AsyncData {
  artist: App.ArtistPage | undefined;
  isFollowing: boolean;
  relatedArtistList: App.ContentItem<'artist'>[];
}

interface Data {
  mutationUnsubscribe: (() => void) | undefined
  HEADER_REF: string;
}

@Component({
  components: {
    Avatar,
    HashTags,
    Followers,
    ContextMediaButton,
    FavoriteButton,
    FollowButton,
    ArtistMenu,
    Tabs,
    Fallback,
  },

  validate({ params }: Context) {
    return params.artistId != null && params.artistId !== '';
  },

  async asyncData(context): Promise<AsyncData> {
    const [
      artist,
      isFollowing,
      relatedArtistList,
    ] = await Promise.all([
      getArtist(context),
      getIsFollowing(context),
      getRelatedArtistList(context),
    ] as const);
    return {
      artist,
      isFollowing,
      relatedArtistList,
    };
  },

  scrollToTop: true,
})
export default class ArtistIdPage extends Vue implements AsyncData, Data {
  artist: App.ArtistPage | undefined = undefined;
  isFollowing = false;
  relatedArtistList: App.ContentItem<'artist'>[] = [];

  mutationUnsubscribe: (() => void) | undefined = undefined;
  HEADER_REF = HEADER_REF;

  head() {
    return {
      title: this.artist?.name ?? 'エラー',
    };
  }

  get avatarSrc(): string | undefined {
    return getImageSrc(this.artist?.images, this.$constant.ARTWORK_BASE_SIZE);
  }
  get isArtistSet(): boolean {
    return this.$getters()['playback/isContextSet'](this.artist?.uri);
  }
  get isPlaying(): RootState['playback']['isPlaying'] {
    return this.$state().playback.isPlaying;
  }
  get tabs(): Item[] {
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
  get isRelatedPage(): boolean {
    const { artistId } = this.$route.params;
    return this.$route.fullPath === `/artists/${artistId}/related`;
  }

  mounted() {
    // ボタンが見えなくなったらヘッダーに表示
    if (this.artist != null) {
      const ref = this.$refs[HEADER_REF] as HTMLDivElement;
      this.$header.observe(ref);
    }

    this.$dispatch('setDefaultDominantBackgroundColor');

    // アーティストをフォロー/アンフォローした後呼ばれる
    const subscribeArtist = (mutationPayload: ExtendedMutationPayload<'library/artists/SET_ACTUAL_IS_SAVED'>) => {
      if (this.artist == null) return;
      const [artistId, isFollowing] = mutationPayload.payload;
      if (artistId === this.artist.id) {
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
    if (this.artist == null) return;

    if (nextPlayingState) {
      this.$dispatch('playback/play', this.isArtistSet
        ? undefined
        : { contextUri: this.artist.uri });
    } else {
      this.$dispatch('playback/pause');
    }
  }

  toggleFollowingState(nextFollowingState: OnFollow['input'] | OnFavorite['input'] | OnMenu['on-follow-menu-clicked']) {
    if (this.artist == null) return;

    // API との通信の結果を待たずに先に表示を変更させておく
    this.isFollowing = nextFollowingState;

    const artistIdList = [this.artist.id];
    if (nextFollowingState) {
      this.$dispatch('library/artists/followArtists', artistIdList);
    } else {
      this.$dispatch('library/artists/unfollowArtists', artistIdList);
    }
  }
}
</script>

<style lang="scss" module>
.Fab {
  @include global-fab();
}

.ArtistIdPage {
  @include page-margin();
  @include page-padding();

  &__header {
    @include page-header();

    margin-bottom: 16px;
  }

  &__tabs {
    margin-bottom: 24px;
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
