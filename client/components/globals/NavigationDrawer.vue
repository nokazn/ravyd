<template>
  <v-navigation-drawer
    app
    permanent
    :color="NAVIGATION_DRAWER_BACKGROUND_COLOR"
    :mobile-breakpoint="768"
    :width="200"
    :class="$style.NavigationDrawer"
    class="NavigationDrawer"
  >
    <v-list :class="$style.NavigationDrawer__list">
      <div :class="$style.NavigationDrawer__header">
        <UserMenu />
      </div>

      <v-divider :class="$style.NavigationDrawer__divider" />

      <template
        v-for="({ subtitle, items, scroll }, index) in navigationDrawerItemLists"
      >
        <v-list-item-group
          :key="index"
          :class="{
            [$style['NavigationDrawer__group--scroll']]: scroll,
            'g-custom-scroll-bar': scroll,
          }"
        >
          <v-subheader
            v-if="subtitle != null"
            :class="$style.NavigationDrawer__subheader"
          >
            {{ subtitle }}
          </v-subheader>

          <v-list-item
            v-for="{ icon, id, name, to } in items"
            :key="id"
            link
            nuxt
            :to="to"
            :title="name"
            dense
            :class="{
              [$style.NavigationDrawer__denseItem]: scroll,
            }"
          >
            <v-list-item-icon v-if="icon != null">
              <v-icon :title="name">
                {{ icon }}
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

        <v-divider
          :key="`${index}-divider`"
          :class="$style.NavigationDrawer__divider"
        />
      </template>

      <v-list-item-group>
        <v-list-item
          dense
          @click="onPlaylistButtonClicked"
        >
          <v-list-item-icon>
            <v-icon title="新規プレイリスト">
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
import { RootState, RootGetters } from 'vuex';

import UserMenu from '~/components/containers/menu/UserMenu.vue';
import CreatePlaylistModal, { On } from '~/components/containers/modal/CreatePlaylistModal.vue';
import { NAVIGATION_DRAWER_BACKGROUND_COLOR } from '~/variables';

type Data = {
  NAVIGATION_DRAWER_BACKGROUND_COLOR: typeof NAVIGATION_DRAWER_BACKGROUND_COLOR
  createPlaylistModal: boolean
}

type NavigationDrawerItemLists = {
  subtitle?: string
  items: {
    name: string
    to: string
    icon?: string
  }[]
  scroll?: boolean
}[]

export default Vue.extend({
  components: {
    UserMenu,
    CreatePlaylistModal,
  },

  data(): Data {
    return {
      NAVIGATION_DRAWER_BACKGROUND_COLOR,
      createPlaylistModal: false,
    };
  },

  computed: {
    listOfPlaylists(): RootState['playlists']['playlists'] {
      return this.$state().playlists.playlists;
    },
    navigationDrawerItemLists(): NavigationDrawerItemLists {
      const mainList = {
        items: [
          {
            name: 'ホーム',
            to: '/',
            icon: 'mdi-home-variant',
          },
          {
            name: '見つける',
            to: '/browse',
            icon: 'mdi-binoculars',
          },
        ],
      };

      const libraryList = {
        subtitle: 'ライブラリ',
        items: [
          {
            name: 'お気に入りの曲',
            to: '/library/tracks',
            icon: 'mdi-music-box-multiple',
          },
          {
            name: 'アルバム',
            to: '/library/releases',
            icon: 'mdi-album',
          },
          {
            name: 'アーティスト',
            to: '/library/artists',
            icon: 'mdi-account-music',
          },
        ],
      };

      const playlistItems = this.listOfPlaylists?.map((playlist) => {
        const to = `/playlists/${playlist.id}`;
        return {
          id: playlist.id,
          name: playlist.name,
          to,
        };
      });

      const playlists = playlistItems != null
        ? {
          subtitle: 'プレイリスト',
          items: playlistItems,
          scroll: true,
        }
        : undefined;

      return playlists != null
        ? [mainList, libraryList, playlists]
        : [mainList, libraryList];
    },
    userAvatarSrc(): RootGetters['auth/userAvatarSrc'] {
      return this.$getters()['auth/userAvatarSrc'];
    },
    userDisplayName(): RootGetters['auth/userDisplayName'] {
      return this.$getters()['auth/userDisplayName'];
    },
  },

  mounted() {
    this.$dispatch('playlists/getAllPlaylists');
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

  &__list {
    display: flex;
    flex-direction: column;
    height: calc(100vh - #{$g-footer-height});
  }

  &__header {
    padding: 8px 12px;
    font-size: 12px;

    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }

  &__group--scroll {
    overflow-y: scroll;
    flex: 1 0;
    margin: -12px 0;
    padding: 12px 0;
  }

  &__denseItem {
    min-height: 36px;
  }

  &__divider {
    margin: 10px 0;
  }

  &__subheader {
    font-size: 12px;
    height: 28px;
  }
}
</style>
