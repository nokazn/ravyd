<template>
  <v-navigation-drawer
    v-if="$screen.isPc"
    app
    permanent
    :color="$constant.NAVIGATION_DRAWER_BACKGROUND_COLOR"
    :width="$constant.NAVIGATION_DRAWER_WIDTH"
    :class="$style.NavigationDrawer"
  >
    <v-list
      nav
      class="g-custom-scroll-bar"
      :class="$style.List"
    >
      <div :class="$style.List__header">
        <AccountMenu />
      </div>

      <v-divider :class="$style.List__divider" />

      <template v-for="({ items, name, subtitle }) in navigationGroupList">
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
        scroll
        name="playlist"
        :items="playlistItems"
        :subtitle="playlistSubtitle"
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

    <CreatePlaylistModal v-model="createPlaylistModal" />
  </v-navigation-drawer>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  unref,
  onMounted,
} from '@vue/composition-api';
import AccountMenu from '~/components/containers/menu/AccountMenu.vue';
import NavigationListItemGroup, { Item } from '~/components/parts/list/NavigationListItemGroup.vue';
import CreatePlaylistModal from '~/components/containers/modal/CreatePlaylistModal.vue';

type NavigationGroup = {
  items: Item[];
  name: string;
  subtitle?: string;
  scroll?: boolean;
}

export default defineComponent({
  components: {
    AccountMenu,
    NavigationListItemGroup,
    CreatePlaylistModal,
  },

  setup(_, { root }) {
    const mainGroup: Readonly<NavigationGroup> = {
      items: [
        {
          name: 'ホーム',
          to: '/',
          icon: 'mdi-home-variant',
        },
        {
          name: '見つける',
          to: '/browse/categories',
          icon: 'mdi-binoculars',
        },
      ],
      name: 'main',
    };
    const libraryGroup: Readonly<NavigationGroup> = {
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
    const navigationGroupList: Readonly<NavigationGroup[]> = [
      mainGroup,
      libraryGroup,
    ];
    const createPlaylistModal = ref(false);

    const playlistItems = computed<Item[]>(() => {
      const listOfPlaylists = root.$getters()['playlists/playlists'];
      const isActiveContext = (uri: string) => root.$getters()['playback/contextUri'] === uri;
      const isPlaying = root.$getters()['playback/isPlaying'];
      return listOfPlaylists?.map((playlist) => {
        const isSet = isActiveContext(playlist.uri);
        return {
          id: playlist.id,
          name: playlist.name,
          to: `/playlists/${playlist.id}`,
          isSet,
          isPlaying: isSet && isPlaying,
        };
      }) ?? [];
    });
    const playlistSubtitle = computed(() => {
      const { length } = unref(playlistItems);
      return length > 0
        ? `プレイリスト (${length})`
        : 'プレイリスト';
    });

    onMounted(() => {
      if (root.$getters()['playlists/playlists'] == null) {
        root.$dispatch('playlists/getAllPlaylists');
      }
    });

    const onPlaylistButtonClicked = () => { createPlaylistModal.value = true; };

    return {
      navigationGroupList,
      createPlaylistModal,
      playlistItems,
      playlistSubtitle,
      onPlaylistButtonClicked,
    };
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
    height: 100%;

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
