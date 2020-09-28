<template>
  <v-bottom-navigation
    v-if="isLoaded"
    app
    grow
    :height="$constant.NAVIGATION_BAR_HEIGHT"
    :background-color="$constant.FOOTER_BACKGROUND_COLOR"
    :class="$style.NavigationFooter"
  >
    <template v-for="item in itemList">
      <v-btn
        v-if="item.type === 'to'"
        :key="item.value"
        nuxt
        :value="item.value"
        :to="item.to"
        :class="$style.Item"
        class="g-no-text-decoration"
      >
        <span :class="$style.Item__text">
          {{ item.text }}
        </span>
        <v-icon>
          {{ item.icon }}
        </v-icon>
      </v-btn>

      <v-btn
        v-else
        :key="item.value"
        @click="item.handler"
      >
        <UserAvatar
          :src="item.iconSrc"
          :alt="item.text"
          :size="36"
        />
      </v-btn>
    </template>
  </v-bottom-navigation>
</template>

<script lang="ts">
import Vue from 'vue';
import type { RawLocation } from 'vue-router';

import UserAvatar from '~/components/parts/image/UserAvatar.vue';

const ICON_SIZR = 32;

type ItemType = 'to' | 'custom';
type Item<T extends ItemType = ItemType> = T extends 'to'
  ? {
    type: T;
    value: string;
    to: RawLocation;
    icon: string;
    text: string;
  }
  : {
    type: T;
    value: string;
    handler: () => void;
    iconSrc: string | undefined;
    text: string;
  };

type Data = {
  isLoaded: boolean;
}

export default Vue.extend({
  components: {
    UserAvatar,
  },

  data(): Data {
    return {
      isLoaded: false,
    };
  },

  computed: {
    itemList(): Item[] {
      const isLoggedin = this.$getters()['auth/isLoggedin'];
      const userAvatarSrc = this.$getters()['auth/userAvatarSrc'](ICON_SIZR);

      const home: Item<'to'> = {
        type: 'to',
        value: 'home',
        to: '/',
        icon: 'mdi-home-variant',
        text: 'ホーム',
      };
      const browse: Item<'to'> = {
        type: 'to',
        value: 'browse',
        to: '/browse',
        icon: 'mdi-binoculars',
        text: '見つける',
      };
      const library: Item<'to'> = {
        type: 'to',
        value: 'library',
        to: '/library',
        icon: 'mdi-bookshelf',
        text: 'ライブラリ',
      };
      const account: Item<'custom'> = {
        type: 'custom',
        value: 'account',
        handler: () => {},
        iconSrc: userAvatarSrc,
        text: 'アカウント',
      };

      return isLoggedin
        ? [home, browse, library, account]
        : [home, browse, library];
    },
  },

  mounted() {
    this.isLoaded = true;
  },
});
</script>

<style lang="scss" module>
.NavigationFooter {
  display: flex;
  justify-content: space-between;
}

.Item {
  &__text {
    font-size: 0.5rem;
  }
}
</style>
