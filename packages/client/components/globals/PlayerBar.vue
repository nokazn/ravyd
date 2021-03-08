<template>
  <PlayerBarMobile
    v-if="$screen.isMobile"
    v-model="isSaved"
    :artwork-src="artworkSrc"
    :track="track"
    :track-name="trackName"
    :has-track="hasTrack"
  />
  <PlayerBarPc
    v-else-if="$screen.isPc"
    v-model="isSaved"
    :artwork-src="artworkSrc"
    :track="track"
    :track-name="trackName"
    :has-track="hasTrack"
  />
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from '@vue/composition-api';
import PlayerBarMobile, { On as OnMobile } from '~/components/globals/PlayerBar.mobile.vue';
import PlayerBarPc, { On as OnPc } from '~/components/globals/PlayerBar.pc.vue';

export type ArtworkSrc = (size: number | undefined) => string;

export default defineComponent({
  components: {
    PlayerBarMobile,
    PlayerBarPc,
  },

  setup(_, { root }) {
    const artworkSrc = (size: number | undefined) => root.$getters()['playback/artworkSrc'](size);
    const track = computed(() => root.$state().playback.track);
    const trackName = computed(() => track.value?.name ?? '不明なトラック');
    const hasTrack = computed(() => root.$getters()['playback/hasTrack']);
    const isSaved = computed<boolean>({
      get() { return root.$state().playback.isSavedTrack; },
      set(saved: OnMobile['input'] | OnPc['input']) {
        const id = track.value?.id;
        if (id == null) return;
        // API との通信の結果を待たずに先に表示を変更させておく
        root.$commit('playback/SET_IS_SAVED_TRACK', saved);
        if (isSaved) {
          root.$dispatch('library/tracks/saveTracks', [id]);
        } else {
          root.$dispatch('library/tracks/removeTracks', [id]);
        }
      },
    });

    onMounted(() => { root.$dispatch('player/initPlayer'); });

    return {
      artworkSrc,
      track,
      trackName,
      hasTrack,
      isSaved,
    };
  },
});
</script>
