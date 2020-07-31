<template>
  <div
    v-if="userInfo != null"
    :class="$style.UserIdPage"
  >
    <div :class="$style.UserIdPage__header">
      <UserAvatar
        :src="avatarSrc"
        :size="AVATAR_SIZE"
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

        <p>
          {{ userInfo.followersText }}
        </p>
      </div>
    </div>
  </div>
  <Fallback v-else>
    ユーザーの情報を取得できませんでした。
  </Fallback>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import UserAvatar from '~/components/parts/avatar/UserAvatar.vue';
import Fallback from '~/components/parts/others/Fallback.vue';
import { getUserInfo } from '~/plugins/local/_userId';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { App } from '~~/types';

const AVATAR_SIZE = 220;

interface AsyncData {
  userInfo: App.UserInfo | undefined
}

interface Data {
  AVATAR_SIZE: number
}

@Component({
  components: {
    UserAvatar,
    Fallback,
  },

  validate({ params }) {
    return params.userId != null && params.userId !== '';
  },

  async asyncData(context): Promise<AsyncData> {
    const [userInfo] = await Promise.all([
      getUserInfo(context),
    ]);

    return {
      userInfo,
    };
  },
})
export default class UserIdPage extends Vue implements AsyncData, Data {
  userInfo: App.UserInfo | undefined = undefined;

  AVATAR_SIZE = AVATAR_SIZE;

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

  mounted() {
    // 小さい画像から抽出
    const artworkSrc = getImageSrc(this.userInfo?.images, 40);
    if (artworkSrc != null) {
      this.$dispatch('extractDominantBackgroundColor', artworkSrc);
    } else {
      this.$dispatch('setDefaultDominantBackgroundColor');
    }
  }
}
</script>

<style lang="scss" module>
.UserIdPage {
  padding: 16px 6% 48px;

  &__header {
    display: grid;
    grid-template-columns: 220px auto;
    grid-column-gap: 24px;
    margin-bottom: 32px;
  }

  .Info {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    &__title {
      font-size: 2em;
      margin: 0.3em 0;
      line-height: 1.2em;
    }
  }
}
</style>
