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
          fab
          :is-playing="isArtistSet && isPlaying "
          @on-clicked="onContextMediaButtonClicked"
        />

        <FavoriteButton
          outlined
          :size="32"
          :is-favorited="isFollowing"
          text="フォロー"
          @on-clicked="toggleFollowingState"
        />

        <ArtistMenu
          :artist="artistInfo"
          :is-following="isFollowing"
          :size="32"
          outlined
          left
          @on-follow-menu-clicked="toggleFollowingState"
        />
      </div>
    </portal>

    <div
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

        <h1 :class="$style.Info__title">
          {{ artistInfo.name }}
        </h1>

        <div :class="$style.Info__footer">
          <p class="subtext--text">
            {{ artistInfo.followersText }}
          </p>

          <div :class="$style.Info__buttons">
            <ContextMediaButton
              :is-playing="isArtistSet && isPlaying "
              @on-clicked="onContextMediaButtonClicked"
            />

            <FollowButton
              :is-following="isFollowing"
              @on-clicked="toggleFollowingState"
            />

            <ArtistMenu
              :artist="artistInfo"
              :is-following="isFollowing"
              outlined
              @on-follow-menu-clicked="toggleFollowingState"
            />
          </div>
        </div>
      </div>
    </div>

    <v-tabs
      v-model="tab"
      :height="32"
      show-arrows="mobile"
      color="active"
      background-color="transparent"
    >
      <v-tab
        v-for="item in tabItemList"
        :key="item.title"
        nuxt
        :to="item.to"
      >
        <span
          :class="[$route.fullPath === item.to ? 'active--text' : 'subtext--text']"
        >
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

import {
  getArtistInfo,
  getIsFollowing,
  getRelatedArtistList,
} from '~/plugins/local/_artistId';
import { getImageSrc } from '~/utils/image/getImageSrc';
import { App } from '~~/types';

const AVATAR_SIZE = 220;
const HEADER_REF = 'HEADER_REF';

type TabItem = {
  title: string
  to: string
}

interface AsyncData {
  artistInfo: App.ArtistInfo | undefined
  isFollowing: boolean
  relatedArtistList: App.ContentItemInfo<'artist'>[]
}

interface Data {
  tab: number | null;
  mutationUnsubscribe: (() => void) | undefined
  HEADER_REF: string
  AVATAR_SIZE: number
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
  AVATAR_SIZE = AVATAR_SIZE;

  head() {
    return {
      title: this.artistInfo?.name ?? 'エラー',
    };
  }

  get avatarSrc(): string | undefined {
    return getImageSrc(this.artistInfo?.images, AVATAR_SIZE);
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

  onContextMediaButtonClicked(nextPlayingState: OnMediaButton['on-clicked']) {
    if (this.artistInfo == null) return;

    if (nextPlayingState) {
      this.$dispatch('playback/play', this.isArtistSet
        ? undefined
        : { contextUri: this.artistInfo.uri });
    } else {
      this.$dispatch('playback/pause');
    }
  }

  toggleFollowingState(nextFollowingState: OnFollow['on-clicked'] | OnFavorite['on-clicked'] | OnMenu['on-follow-menu-clicked']) {
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
  display: flex;
  flex-wrap: nowrap;

  & > *:not(:last-child) {
    margin-right: 0.5vw;
  }
}

.ArtistIdPage {
  padding: 16px max(12px, 4vw) 48px;

  &__header {
    display: grid;
    grid-template-columns: 220px auto;
    column-gap: 24px;
    margin-bottom: 32px;
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
      margin-bottom: 0.15rem;
    }

    &__title {
      font-size: 2em;
      margin: 0.3em 0;
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

  .Tabs {
    margin-bottom: 24px;
  }
}
</style>
