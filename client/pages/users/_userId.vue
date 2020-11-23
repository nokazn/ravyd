<template>
  <div
    v-if="user != null"
    :class="$style.UserIdPage"
  >
    <portal :to="$header.PORTAL_NAME">
      <div
        v-if="user != null"
        :class="$style.Fab"
      >
        <FavoriteButton
          v-if="isFollowing != null"
          text="フォロー"
          :fab="$screen.isSp"
          :outlined="!$screen.isSp"
          :value="isFollowing"
          @input="toggleFollowingState"
        />
        <UserMenu
          left
          :fab="$screen.isSp"
          :outlined="!$screen.isSp"
          :user="user"
          :following="isFollowing"
          @on-follow-menu-clicked="toggleFollowingState"
        />
      </div>
    </portal>

    <div
      :ref="HEADER_REF"
      :class="$style.UserIdPage__header"
    >
      <Avatar
        type="user"
        :src="avatarSrc"
        :size="Math.min($screen.artworkSize, 200)"
        :alt="userName"
        :title="userName"
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
          {{ playlistCountsText }}・
          <Followers :followers="user.followers" />
        </p>

        <div :class="$style.Info__buttons">
          <FollowButton
            v-if="isFollowing != null"
            :value="isFollowing"
            @input="toggleFollowingState"
          />
          <UserMenu
            outlined
            right
            :user="user"
            :following="isFollowing"
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
      v-if="userPlaylists.items.length > 0"
      :min-width="$screen.cardWidthMinMax[0]"
      :max-width="$screen.cardWidthMinMax[1]"
    >
      <PlaylistCard
        v-for="playlist in userPlaylists.items"
        :key="playlist.id"
        :item="playlist"
        :min-width="$screen.cardWidthMinMax[0]"
        :max-width="$screen.cardWidthMinMax[1]"
      />
    </CardsWrapper>
    <p v-else>
      プレイリストがありません。
    </p>

    <IntersectionLoadingCircle
      :loading="userPlaylists.hasNext"
      @appear="appendPlaylists"
    />
  </div>
  <Fallback v-else>
    ユーザーの情報を取得できませんでした。
  </Fallback>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import Avatar from '~/components/parts/image/Avatar.vue';
import Followers from '~/components/parts/text/Followers.vue';
import FollowButton, { On as OnFollowButton } from '~/components/parts/button/FollowButton.vue';
import FavoriteButton, { On as OnFavoriteButton } from '~/components/parts/button/FavoriteButton.vue';
import UserMenu, { On as OnUserMenu } from '~/components/parts/menu/UserMenu.vue';
import CardsWrapper from '~/components/parts/wrapper/CardsWrapper.vue';
import PlaylistCard from '~/components/containers/card/PlaylistCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import Fallback from '~/components/parts/others/Fallback.vue';
import {
  getUser,
  getIsFollowing,
  getUserPlaylists,
  UserPlaylists,
} from '~/services/local/_userId';
import { getImageSrc } from '~/services/converter';
import type { App, OneToFifty } from '~~/types';

const LIMIT_OF_PLAYLISTS = 30;
const HEADER_REF = 'HEADER_REF';

interface AsyncData {
  user: App.UserPage | undefined;
  isFollowing: boolean | undefined;
  userPlaylists: UserPlaylists;
}

interface Data {
  HEADER_REF: string;
}

@Component({
  components: {
    Avatar,
    Followers,
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
    const [user, isFollowing, userPlaylists] = await Promise.all([
      getUser(context),
      getIsFollowing(context),
      getUserPlaylists(context, { limit: LIMIT_OF_PLAYLISTS }),
    ] as const);

    return {
      user,
      isFollowing,
      userPlaylists,
    };
  },
})
export default class UserIdPage extends Vue implements AsyncData, Data {
  user: App.UserPage | undefined = undefined;
  isFollowing: boolean | undefined = undefined;
  userPlaylists: UserPlaylists = {
    items: [],
    hasNext: false,
    hasPrevious: false,
    total: 0,
  };

  HEADER_REF = HEADER_REF;

  head() {
    return {
      title: this.userName ?? 'エラー',
    };
  }

  get avatarSrc(): string | undefined {
    return getImageSrc(this.user?.images);
  }
  get userName(): string | undefined {
    const { user } = this;
    return user?.displayName ?? user?.id;
  }
  get playlistCountsText(): string {
    return `${this.userPlaylists.total}個のプレイリスト`;
  }

  mounted() {
    if (this.user != null) {
      const ref = this.$refs[HEADER_REF] as HTMLDivElement;
      this.$header.observe(ref);
    }

    // 小さい画像から抽出
    const artworkSrc = getImageSrc(this.user?.images, 40);
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
    if (!this.userPlaylists.hasNext) return;

    const currentPlaylists = this.userPlaylists;
    const { userId } = this.$route.params;
    const offset = currentPlaylists.items.length;
    const playlists = await this.$spotify.playlists.getListOfUserPlaylist({
      userId,
      limit,
      offset,
    });
    if (playlists == null) {
      this.userPlaylists = {
        ...currentPlaylists,
        hasNext: false,
      };
      return;
    }

    const addedPlaylists = playlists.items;
    this.userPlaylists = {
      ...currentPlaylists,
      items: [...currentPlaylists.items, ...addedPlaylists],
      hasNext: playlists.next != null,
    };
  }

  toggleFollowingState(nextFollowingState: OnFollowButton['input'] | OnFavoriteButton['input']| OnUserMenu['on-follow-menu-clicked']) {
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
      this.$toast.pushError(nextFollowingState
        ? 'ユーザーをフォローすることができませんでした。'
        : 'ユーザーのフォローを解除することができませんでした。');
    });
  }
}
</script>

<style lang="scss" module>
.Fab {
  @include global-fab();
}

.UserIdPage {
  @include page-margin();
  @include page-padding();

  &__header {
    margin-bottom: 24px;

    // 200px と少し小さめにする
    @include page-header(200px);
  }
}

.Divider {
  margin: 4px 0 16px;
}

.Info {
  @include page-info();

  &__title {
    @include page-title();
  }

  &__buttons {
    @include page-header-buttons();
  }
}
</style>
