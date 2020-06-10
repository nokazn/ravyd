<template>
  <v-navigation-drawer
    app
    permanent
    :color="NAVIGATION_DRAWER_BACKGROUND_COLOR"
    :mobile-break-point="768"
    :width="200"
    :class="$style.NavigationDrawer"
    class="NavigationDrawer"
  >
    <v-list :class="$style.NavigationDrawer__list">
      <div :class="$style.NavigationDrawer__header">
        <UserMenu />
      </div>


      <v-list-item-group
        v-for="({ subtitle, items }, index) in navigationDrawerItemLists"
        :key="index"
      >
        <v-divider :class="$style.NavigationDrawer__divider" />
        <v-subheader
          v-if="subtitle != null"
          :class="$style.NavigationDrawer__subheader"
          v-text="subtitle"
        />

        <v-list-item
          v-for="{ icon, title, to } in items"
          :key="title"
          link
          nuxt
          :to="to"
          dense
        >
          <v-list-item-icon v-if="icon != null">
            <v-icon v-text="icon" />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="title" />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>

      <v-list-item-group :class="$style.NavigationDrawer__lastGroup">
        <v-divider :class="$style.NavigationDrawer__divider" />

        <v-list-item
          dense
          @click="onPlaylistButtonClicked"
        >
          <v-list-item-icon>
            <v-icon>
              mdi-plus-circle
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              新規プレイリスト
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <CreatePlaylistModal
      :is-shown="createPlaylistModal"
      @on-changed="onCreatePlaylistModalChanged"
    />
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootGetters } from 'vuex';

import UserMenu from '~/components/containers/menu/UserMenu.vue';
import CreatePlaylistModal, { On } from '~/components/containers/modal/createPlaylistModal.vue';
import { NAVIGATION_DRAWER_BACKGROUND_COLOR } from '~/variables';

type Data = {
  NAVIGATION_DRAWER_BACKGROUND_COLOR: typeof NAVIGATION_DRAWER_BACKGROUND_COLOR
  navigationDrawerItemLists: {
    subtitle?: string
    items: {
      title: string
      to: string
      icon?: string
    }[]
  }[]
  createPlaylistModal: boolean
}

export default Vue.extend({
  components: {
    UserMenu,
    CreatePlaylistModal,
  },

  data(): Data {
    return {
      NAVIGATION_DRAWER_BACKGROUND_COLOR,
      navigationDrawerItemLists: [
        {
          items: [
            {
              title: 'ホーム',
              to: '/',
              icon: 'mdi-home-variant',
            },
            {
              title: '見つける',
              to: '/browse',
              icon: 'mdi-binoculars',
            },
          ],
        },
        {
          subtitle: 'ライブラリ',
          items: [
            {
              title: 'お気に入りの曲',
              to: '/library/tracks',
            },
            {
              title: 'アルバム',
              to: '/library/releases',
            },
            {
              title: 'アーティスト',
              to: '/library/artists',
            },
          ],
        },
      ],
      createPlaylistModal: false,
    };
  },

  computed: {
    userAvatarSrc(): RootGetters['auth/userAvatarSrc'] {
      return this.$getters()['auth/userAvatarSrc'];
    },
    userDisplayName(): RootGetters['auth/userDisplayName'] {
      return this.$getters()['auth/userDisplayName'];
    },
  },

  methods: {
    onPlaylistButtonClicked() {
      this.createPlaylistModal = true;
    },
    onCreatePlaylistModalChanged(isShown: On['on-changed']) {
      this.createPlaylistModal = isShown;
    },
  },
});
</script>

<style lang="scss" module>
.NavigationDrawer {
  z-index: z-index-of(navigation-drawer);
  &__header {
    padding: 8px 12px;
    font-size: 12px;
    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }

  &__list {
    height: 100%;
  }

  &__divider {
    margin: 12px 0;
  }

  &__subheader {
    font-size: 12px;
  }

  &__lastGroup {
    position: absolute;
    bottom: 12px;
    left: 0;
    right: 0
  }
}
</style>
