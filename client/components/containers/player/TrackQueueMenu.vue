<template>
  <CustomMenu
    :key="trackQueue.length"
    v-model="menu"
    top
    left
    offset-y
    :class="$style.TrackQueueMenu"
  >
    <template #activator="{ on }">
      <v-btn
        icon
        :width="36"
        :height="36"
        title="再生リスト"
        v-on="on"
        @click="toggleMenu"
      >
        <v-icon>
          mdi-playlist-play
        </v-icon>
      </v-btn>
    </template>

    <template #header>
      <div :class="$style.TrackQueueMenu__header">
        <v-subheader>
          再生リスト
        </v-subheader>

        <v-btn
          icon
          small
          title="再生中のページ"
          :disabled="contextPath == null"
          :to="contextPath"
          class="g-no-text-decoration"
        >
          <v-icon>
            mdi-playlist-music
          </v-icon>
        </v-btn>
      </div>
    </template>

    <template #footer>
      <div :class="$style.TrackQueueMenu__footer">
        <v-btn
          rounded
          text
          small
          nuxt
          to="/library/history"
        >
          最近再生した項目
        </v-btn>
      </div>
    </template>

    <v-list-item-group
      v-if="trackQueue.length > 0"
      :class="$style.TrackQueueMenu__wrapper"
      class="g-custom-scroll-bar"
    >
      <TrackQueueMenuItem
        v-for="(track, index) in trackQueue"
        :key="`${track.id}-${index}`"
        :item="track"
        @on-item-clicked="onItemClicked"
        @on-link-clicked="toggleMenu"
      />
    </v-list-item-group>

    <div
      v-else
      :class="$style['TrackQueueMenu__wrapper--empty']"
    >
      再生待ちの曲はありません。
    </div>
  </CustomMenu>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import CustomMenu from '~/components/parts/menu/CustomMenu.vue';
import TrackQueueMenuItem, { On as OnItem } from '~/components/parts/list/TrackQueueMenuItem.vue';
import { convertUriToUrl } from '~/services/converter';

export default defineComponent({
  components: {
    CustomMenu,
    TrackQueueMenuItem,
  },

  setup(_, { root }) {
    const menu = ref(false);
    const trackQueue = computed(() => root.$getters()['playback/trackQueue']);
    const contextPath = computed(() => convertUriToUrl(root.$getters()['playback/contextUri']));

    const toggleMenu = () => { menu.value = !menu.value; };
    const onItemClicked = async (row: OnItem['on-item-clicked']) => {
      const isNext = row.index > 0;
      const counts = Math.abs(row.index);
      // @todo #174 次に再生に追加した曲が再生できないのに対処するため
      for (let i = 0; i < counts; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await root.$dispatch(isNext
          ? 'playback/next'
          : 'playback/previous');
      }

      // const { contextUri, customTrackUriList } = root.$state().playback;
      // // album と playlist は contextUri + offset で操作できる
      // if (contextUri != null && /album|playlist/.test(contextUri)) {
      //   // @todo #54 プレイリスト再生の際 position を uri で指定すると、403 が返る場合があるので index で指定
      //   root.$dispatch('playback/play', {
      //     contextUri,
      //     offset: customTrackUriList != null && contextUri.includes('playlist')
      //       ? { position: customTrackUriList?.findIndex((trackUri) => trackUri === row.uri) }
      //       : { uri: row.uri },
      //   });
      // } else {
      //   // Playback SDK から提供される contextUri が不適当かどうかで場合分け
      //   const trackUriList = contextUri == null && customTrackUriList != null
      //     ? customTrackUriList
      //     : trackQueue.value.map((track) => track.uri);
      //   root.$dispatch('playback/play', {
      //     trackUriList,
      //     offset: { uri: row.uri },
      //   });
      // }
    };

    return {
      menu,
      trackQueue,
      contextPath,
      onItemClicked,
      toggleMenu,
    };
  },
});
</script>

<style lang="scss" module>
.TrackQueueMenu {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 12px;
  }

  &__wrapper {
    min-height: 72px;
    min-width: 400px;
    max-width: min(500px, 80vw);
    // header と footer の分を差し引く
    max-height: calc(70vh - 80px);
    overflow-y: auto;

    &--empty {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1.5em 1em;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }
}
</style>
