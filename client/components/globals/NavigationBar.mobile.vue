<template>
  <v-bottom-navigation
    v-if="isLoaded"
    app
    grow
    :background-color="$constant.FOOTER_BACKGROUND_COLOR"
    :height="$constant.NAVIGATION_BAR_HEIGHT"
    :class="$style.NavigationBar"
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
        <Avatar
          type="user"
          :src="item.iconSrc"
          :alt="item.text"
          :size="36"
        />
      </v-btn>
    </template>
  </v-bottom-navigation>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import type { RawLocation } from 'vue-router';

import { useIsLoaded } from '~/use/util';
import Avatar from '~/components/parts/image/Avatar.vue';

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

export default defineComponent({
  components: {
    Avatar,
  },

  setup(_, { root }) {
    const isLoaded = useIsLoaded();

    const itemList = computed<Item[]>(() => {
      const isLoggedin = root.$getters()['auth/isLoggedin'];
      const userAvatarSrc = root.$getters()['auth/userAvatarSrc'](ICON_SIZR);
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
        to: '/browse/categories',
        icon: 'mdi-binoculars',
        text: '見つける',
      };
      const library: Item<'to'> = {
        type: 'to',
        value: 'library',
        to: '/library/tracks',
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
    });

    return {
      isLoaded,
      itemList,
    };
  },
});
</script>

<style lang="scss" module>
$border-color: darken($g-footer-background-color, 6%);

.NavigationBar {
  display: flex;
  justify-content: space-between;
  border-top: solid 1px $border-color;
  border-color: $border-color !important;
  box-sizing: border-box;
  z-index: z-index-of(footer) !important;
}

.Item {
  &__text {
    font-size: 0.5rem;
  }
}
</style>
