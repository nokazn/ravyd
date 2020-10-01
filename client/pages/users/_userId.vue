<template>
  <div
    v-if="userInfo != null"
    :class="$style.UserIdPage"
  >
    <portal :to="$header.PORTAL_NAME">
      <div
        v-if="userInfo != null"
        :class="$style.AdditionalHeaderContent"
      >
        <FavoriteButton
          v-if="isFollowing != null"
          outlined
          :size="32"
          :is-favorited="isFollowing"
          text="フォロー"
          @on-clicked="toggleFollowingState"
        />
        <UserMenu
          outlined
          left
          :size="32"
          :user="userInfo"
          :is-following="isFollowing"
          @on-follow-menu-clicked="toggleFollowingState"
        />
      </div>
    </portal>

    <div
      :ref="HEADER_REF"
      :class="$style.UserIdPage__header"
    >
      <UserAvatar
        :src="avatarSrc"
        :size="Math.min($window.artworkSize, 200)"
        :alt="userName"
        :title="userName"
        default-user-icon="mdi-account"
        shadow
      />

      <div :class="$style.Info">
        <div class="g-small-text">
          ユーザー
        </div>

        <h1 :class="$style.Info__title">
          {{ userName }}
        </h1>

        <p class="subtext--text">
          {{ playlistCountsText }}・{{ userInfo.followersText }}
        </p>

        <div :class="$style.Info__buttons">
          <FollowButton
            v-if="isFollowing != null"
            :is-following="isFollowing"
            @on-clicked="toggleFollowingState"
          />
          <UserMenu
            outlined
            right
            :user="userInfo"
            :is-following="isFollowing"
            @on-follow-menu-clicked="toggleFollowingState"
          />
        </div>
      </div>
    </div>

    <h2>
      公開プレイリスト
    </h2>

    <v-divider :class="$style.Divider" />

    <CardsWrapper
      v-if="userPlaylistInfo.playlists.length > 0"
      :min-width="$window.cardWidthMinMax[0]"
      :max-width="$window.cardWidthMinMax[1]"
    >
      <PlaylistCard
        v-for="playlist in userPlaylistInfo.playlists"
        :key="playlist.id"
        v-bind="playlist"
        :min-width="$window.cardWidthMinMax[0]"
        :max-width="$window.cardWidthMinMax[1]"
      />
    </CardsWrapper>
    <p v-else>
      プレイリストがありません。
    </p>

    <IntersectionLoadingCircle
      :is-loading="userPlaylistInfo.hasNext"
      @on-appeared="appendPlaylists"
    />
  </div>
  <Fallback v-else>
    ユーザーの情報を取得できませんでした。
  </Fallback>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import UserAvatar from '~/components/parts/image/UserAvatar.vue';
import FollowButton, { On as OnFollowButton } from '~/components/parts/button/FollowButton.vue';
import FavoriteButton, { On as OnFavoriteButton } from '~/components/parts/button/FavoriteButton.vue';
import UserMenu, { On as OnUserMenu } from '~/components/parts/menu/UserMenu.vue';
import CardsWrapper from '~/components/parts/wrapper/CardsWrapper.vue';
import PlaylistCard from '~/components/containers/card/PlaylistCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import Fallback from '~/components/parts/others/Fallback.vue';

import { getUserInfo, getIsFollowing, getUserPlaylists } from '~/plugins/local/_userId';
import { getImageSrc } from '~/utils/image';
import { convertPlaylistForCard } from '~/utils/converter';
import { App, OneToFifty } from '~~/types';

const LIMIT_OF_PLAYLISTS = 30;
const HEADER_REF = 'HEADER_REF';

interface AsyncData {
  userInfo: App.UserInfo | undefined
  isFollowing: boolean | undefined
  userPlaylistInfo: App.UserPlaylistInfo
}

interface Data {
  HEADER_REF: string
}

@Component({
  components: {
    UserAvatar,
    FollowButton,
    FavoriteButton,
    UserMenu,
    CardsWrapper,
    PlaylistCard,
    IntersectionLoadingCircle,
    Fallback,
  },

  validate({ params }) {
    return params.userId != null && params.userId !== '';
  },

  async asyncData(context): Promise<AsyncData> {
    const [userInfo, isFollowing, userPlaylistInfo] = await Promise.all([
      getUserInfo(context),
      getIsFollowing(context),
      getUserPlaylists(context, { limit: LIMIT_OF_PLAYLISTS }),
    ] as const);

    return {
      userInfo,
      isFollowing,
      userPlaylistInfo,
    };
  },
})
export default class UserIdPage extends Vue implements AsyncData, Data {
  userInfo: App.UserInfo | undefined = undefined;
  isFollowing: boolean | undefined = undefined;
  userPlaylistInfo: App.UserPlaylistInfo = {
    playlists: [],
    hasNext: false,
    total: 0,
  };

  HEADER_REF = HEADER_REF;

  head() {
    return {
      title: this.userName ?? 'エラー',
    };
  }

  get avatarSrc(): string | undefined {
    return getImageSrc(this.userInfo?.images);
  }
  get userName(): string | undefined {
    const { userInfo } = this;
    return userInfo?.displayName ?? userInfo?.id;
  }
  get playlistCountsText(): string {
    const { total } = this.userPlaylistInfo;
    return `${total}個のプレイリスト`;
  }

  mounted() {
    if (this.userInfo != null) {
      const ref = this.$refs[HEADER_REF] as HTMLDivElement;
      this.$header.observe(ref);
    }

    // 小さい画像から抽出
    const artworkSrc = getImageSrc(this.userInfo?.images, 40);
    if (artworkSrc != null) {
      this.$dispatch('extractDominantBackgroundColor', artworkSrc);
    } else {
      this.$dispatch('setDefaultDominantBackgroundColor');
    }
  }

  beforeDestroy() {
    this.$header.disconnectObserver();
  }

  async appendPlaylists(limit: OneToFifty = LIMIT_OF_PLAYLISTS) {
    if (!this.userPlaylistInfo.hasNext) return;

    const { userPlaylistInfo } = this;
    const { userId } = this.$route.params;
    const offset = userPlaylistInfo.playlists.length;
    const playlists = await this.$spotify.playlists.getListOfUserPlaylist({
      userId,
      limit,
      offset,
    });
    if (playlists == null) {
      this.userPlaylistInfo = {
        ...userPlaylistInfo,
        hasNext: false,
      };
      return;
    }

    const addedPlaylists = playlists.items.map(convertPlaylistForCard);
    this.userPlaylistInfo = {
      ...userPlaylistInfo,
      playlists: [...userPlaylistInfo.playlists, ...addedPlaylists],
      hasNext: playlists.next != null,
    };
  }

  toggleFollowingState(nextFollowingState: OnFollowButton['on-clicked'] | OnFavoriteButton['on-clicked']| OnUserMenu['on-follow-menu-clicked']) {
    const handler = (params: {
      type: 'artist' | 'user',
      idList: string[],
    }) => (nextFollowingState
      ? this.$spotify.following.follow(params)
      : this.$spotify.following.unfollow(params));

    handler({
      type: 'user',
      idList: [this.$route.params.userId],
    }).then(() => {
      this.isFollowing = nextFollowingState;
    }).catch((err: Error) => {
      console.error({ err });
      const message = nextFollowingState
        ? 'ユーザーをフォローすることができませんでした。'
        : 'ユーザーのフォローを解除することができませんでした。';
      this.$toast.push({
        color: 'error',
        message,
      });
    });
  }
}
</script>

<style lang="scss" module>
.AdditionalHeaderContent {
  @include additional-header-content();
}

.UserIdPage {
  @include page-margin;
  @include page-padding;

  &__header {
    margin-bottom: 24px;

    // 200px と少し小さめにする
    @include page-header(200px);
  }

  .Divider {
    margin: 4px 0 16px;
  }

  .Info {
    @include page-info;

    &__title {
      @include page-title;
    }

    &__buttons {
      @include page-header-buttons;
    }
  }
}
</style>
