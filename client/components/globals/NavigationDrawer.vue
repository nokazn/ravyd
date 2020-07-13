<template>
  <v-navigation-drawer
    app
    permanent
    :color="NAVIGATION_DRAWER_BACKGROUND_COLOR"
    :mobile-breakpoint="768"
    :width="NAVIGATION_DRAWER_WIDTH"
    :class="$style.NavigationDrawer"
    class="NavigationDrawer"
  >
    <v-list
      :class="[
        $style.NavigationDrawer__list,
        $style.List,
      ]"
      class="g-custom-scroll-bar"
    >
      <div :class="$style.List__header">
        <UserMenu />
      </div>

      <v-divider :class="$style.List__divider" />

      <template
        v-for="({ items, name, subtitle }) in navigationGroupList"
      >
        <NavigationListItemGroup
          :key="name"
          :items="items"
          :subtitle="subtitle"
        />

        <v-divider
          :key="`${name}-divider`"
          :class="$style.List__divider"
        />
      </template>

      <NavigationListItemGroup
        v-bind="playlistGroup"
        @on-loaded="onPlaylistGroupLoaded"
      />

      <v-divider :class="$style.List__divider" />

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
import NavigationListItemGroup, { Item } from '~/components/parts/list/NavigationListItemGroup.vue';
import CreatePlaylistModal, { On } from '~/components/parts/modal/CreatePlaylistModal.vue';
import { NAVIGATION_DRAWER_BACKGROUND_COLOR, NAVIGATION_DRAWER_WIDTH } from '~/variables';

type NavigationGroup = {
  items: Item[]
  name: string
  subtitle?: string
  scroll?: boolean
}

type Data = {
  navigationGroupList: NavigationGroup[]
  createPlaylistModal: boolean
  NAVIGATION_DRAWER_BACKGROUND_COLOR: typeof NAVIGATION_DRAWER_BACKGROUND_COLOR
  NAVIGATION_DRAWER_WIDTH: number
}

export default Vue.extend({
  components: {
    UserMenu,
    NavigationListItemGroup,
    CreatePlaylistModal,
  },

  data(): Data {
    const mainGroup = {
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
      name: 'main',
    };

    const libraryGroup = {
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
      name: 'library',
    };

    const navigationGroupList = [mainGroup, libraryGroup];

    return {
      navigationGroupList,
      createPlaylistModal: false,
      NAVIGATION_DRAWER_BACKGROUND_COLOR,
      NAVIGATION_DRAWER_WIDTH,
    };
  },

  computed: {
    listOfPlaylists(): RootState['playlists']['playlists'] {
      return this.$state().playlists.playlists;
    },
    isActiveContext(): (uri: string) => boolean {
      return (uri: string) => (uri != null
        ? this.$getters()['player/contextUri'] === uri
        : false);
    },
    isPlaying(): RootState['player']['isPlaying'] {
      return this.$state().player.isPlaying;
    },
    playlistGroup(): NavigationGroup {
      const items = this.listOfPlaylists?.map((playlist) => {
        const to = `/playlists/${playlist.id}`;
        const isSet = this.isActiveContext(playlist.uri);

        return {
          id: playlist.id,
          name: playlist.name,
          to,
          isSet,
          isPlaying: isSet && this.isPlaying,
        };
      }) ?? [];
      const subtitle = items.length > 0
        ? `プレイリスト (${items.length})`
        : 'プレイリスト';

      const playlists = {
        items,
        name: 'playlist',
        subtitle,
        scroll: true,
      };

      return playlists;
    },
    userAvatarSrc(): RootGetters['auth/userAvatarSrc'] {
      return this.$getters()['auth/userAvatarSrc'];
    },
    userDisplayName(): RootGetters['auth/userDisplayName'] {
      return this.$getters()['auth/userDisplayName'];
    },
  },

  methods: {
    onPlaylistGroupLoaded() {
      if (this.$state().playlists.playlists == null) {
        this.$dispatch('playlists/getAllPlaylists');
      }
    },
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
  z-index: z-index-of(navigation-drawer) !important;

  &__list {
    display: flex;
    flex-direction: column;
    height: calc(100vh - #{$g-footer-height});
    overflow-y: auto;

    .List {
      &__header {
        padding: 4px 12px;
        font-size: 12px;

        & > *:not(:last-child) {
          margin-right: 8px;
        }
      }

      &__divider {
        margin: 8px 0;
      }
    }
  }
}
</style>
