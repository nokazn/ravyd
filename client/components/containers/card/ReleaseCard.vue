<template>
  <Card
    :width="width"
    :min-width="width"
    :max-width="maxWidth || width"
    @click="onCardClicked"
  >
    <template #image>
      <nuxt-link :to="releasePath">
        <ReleaseArtwork
          overlay
          :border-radius="2"
          :src="artworkSrc"
          :alt="item.name"
          :size="width"
          :min-size="minWidth || width"
          :max-size="maxWidth || width"
          :icon="mediaIcon"
          :title="item.name"
          @on-media-button-clicked="onMediaButtonClicked"
        />
      </nuxt-link>
    </template>

    <template #title>
      <nuxt-link
        :to="releasePath"
        :title="item.name"
        class="g-ellipsis-text"
      >
        {{ item.name }}
      </nuxt-link>
    </template>

    <template #subtitle>
      <template v-if="discograpy">
        <time
          v-if="item.type === 'album'"
          :datetime="item.releaseYear"
          class="g-ellipsis-text"
        >
          {{ item.releaseYear }}
        </time>
      </template>
      <template v-else>
        <ArtistNames
          :artists="item.artists"
          class="g-ellipsis-text"
        />
      </template>
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import type { RawLocation } from 'vue-router';

import Card from '~/components/parts/card/Card.vue';
import ReleaseArtwork, { MediaIcon } from '~/components/parts/image/ReleaseArtwork.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import { getImageSrc } from '~/utils/image';
import type { App } from '~~/types';

export default defineComponent({
  components: {
    Card,
    ReleaseArtwork,
    ArtistNames,
  },

  props: {
    item: {
      type: Object as PropType<App.ReleaseCard>,
      required: true,
    },
    width: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    minWidth: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    maxWidth: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    // subtitle を releaseYear にする
    discograpy: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { root }) {
    const artworkSrc = computed(() => getImageSrc(
      props.item.images,
      props.maxWidth ?? props.width,
    ));
    const releasePath = computed<RawLocation>(() => ({
      path: `/releases/${props.item.releaseId}`,
      query: props.item.type === 'track'
        ? { track: props.item.id }
        : undefined,
    }));
    const isReleaseSet = computed(() => {
      // トラックのカードでトラックがセットされているか、アルバムのカードでアルバムがセットされているか
      if (props.item.type === 'track') {
        return root.$getters()['playback/isTrackSet'](props.item.id);
      }
      return root.$getters()['playback/isContextSet'](props.item.uri);
    });
    const isPlaying = computed(() => root.$state().playback.isPlaying);
    const mediaIcon = computed<MediaIcon>(() => {
      return isReleaseSet.value && isPlaying.value
        ? 'mdi-pause-circle'
        : 'mdi-play-circle';
    });

    const onCardClicked = () => { root.$router.push(releasePath.value); };
    const onMediaButtonClicked = () => {
      if (isReleaseSet.value) {
        root.$dispatch(isPlaying.value
          ? 'playback/pause'
          : 'playback/play');
        return;
      }
      // トラックとアルバムのカードで場合分け
      const params = props.item.type === 'track'
        ? { trackUriList: [props.item.uri] }
        : { contextUri: props.item.uri };
      // プレイヤーにセットされた release の場合は一時停止中のトラックをそのまま再生する
      root.$dispatch('playback/play', params);
    };

    return {
      artworkSrc,
      releasePath,
      isReleaseSet,
      isPlaying,
      mediaIcon,
      onCardClicked,
      onMediaButtonClicked,
    };
  },
});
</script>
