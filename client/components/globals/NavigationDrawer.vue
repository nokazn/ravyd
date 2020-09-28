<template>
  <v-navigation-drawer
    v-if="$window.isPc"
    app
    permanent
    :color="$constant.NAVIGATION_DRAWER_BACKGROUND_COLOR"
    :width="$constant.NAVIGATION_DRAWER_WIDTH"
    :class="$style.NavigationDrawer"
    class="NavigationDrawer"
  >
    <v-list
      nav
      :class="$style.List"
      class="g-custom-scroll-bar"
      :style="listStyles"
    >
      <div :class="$style.List__header">
        <AccountMenu />
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

      <NavigationListItemGroup v-bind="playlistGroup" />

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
import type { RootState } from 'typed-vuex';

import AccountMenu from '~/components/containers/menu/AccountMenu.vue';
import NavigationListItemGroup, { Item } from '~/components/parts/list/NavigationListItemGroup.vue';
import CreatePlaylistModal, { On } from '~/components/parts/modal/CreatePlaylistModal.vue';

type NavigationGroup = {
  items: Item[]
  name: string
  subtitle?: string
  scroll?: boolean
}

type Data = {
  navigationGroupList: NavigationGroup[]
  createPlaylistModal: boolean
}

export default Vue.extend({
  components: {
    AccountMenu,
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
        {
          name: 'ポッドキャスト',
          to: '/library/shows',
          icon: 'mdi-podcast',
        },
      ],
      name: 'library',
    };

    const navigationGroupList = [mainGroup, libraryGroup];

    return {
      navigationGroupList,
      createPlaylistModal: false,
    };
  },

  computed: {
    listOfPlaylists(): RootState['playlists']['playlists'] {
      return this.$state().playlists.playlists;
    },
    isActiveContext(): (uri: string) => boolean {
      return (uri: string) => (uri != null
        ? this.$getters()['playback/contextUri'] === uri
        : false);
    },
    isPlaying(): RootState['playback']['isPlaying'] {
      return this.$state().playback.isPlaying;
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
    // 他のデバイスで再生中の場合高さが変わる
    listStyles(): { height: string } {
      const { isPc } = this.$window;
      const isAnotherDevicePlaying = this.$getters()['playback/isAnotherDevicePlaying'];
      let footerHeight = this.$constant.FOOTER_HEIGHT;
      // ナビゲーションバーが表示されているとき
      if (!isPc) footerHeight += this.$constant.NAVIGATION_BAR_HEIGHT;
      // 他のデバイスで再生中のとき
      if (isAnotherDevicePlaying) footerHeight += this.$constant.DEVICE_BAR_HEIGHT;
      const height = `calc(100vh - ${footerHeight}px)`;

      return { height };
    },
  },

  mounted() {
    this.getAllPlaylists();
  },

  methods: {
    getAllPlaylists() {
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

  .List {
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    &__header {
      padding: 4px 12px;
      font-size: 0.8em;

      & > *:not(:last-child) {
        margin-right: 8px;
      }
    }

    &__divider {
      margin: 6px 0;
    }
  }
}
</style>
