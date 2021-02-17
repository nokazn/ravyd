<template>
  <div
    :title="title"
    :class="$style.MarqueeArtistNames"
    class="subtext--text"
  >
    <div
      ref="MARQUEE_TEXT_REF"
      :style="marqueeStyles"
      @mouseover="onHovered"
    >
      <template v-for="({ name, id }, index) in artists">
        <nuxt-link
          :key="id"
          :to="artistPath(id)"
        >
          {{ name }}
        </nuxt-link>
        <span
          v-if="index !== artists.length - 1"
          :key="`${id}-comma`"
        >, </span>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  PropType,
} from '@vue/composition-api';
import { useMarqueeText } from '~/use/style';
import type { App } from '~/entities';

export default defineComponent({
  props: {
    artists: {
      type: Array as PropType<App.MinimumArtist[]>,
      required: true,
    },
  },

  setup(props) {
    const artistPath = (id: string) => `/artists/${id}`;
    const title = computed(() => props.artists
      .map((artist) => artist.name)
      .join(', '));
    const MARQUEE_TEXT_REF = ref<HTMLDivElement>();

    const {
      marqueeStyles,
      calculateWidth,
      onHovered,
      resetTimer,
    } = useMarqueeText(MARQUEE_TEXT_REF);

    watch(ref(props.artists), () => {
      resetTimer();
      calculateWidth();
    });

    return {
      artistPath,
      title,
      marqueeStyles,
      onHovered,
      MARQUEE_TEXT_REF,
    };
  },
});
</script>

<style lang="scss" module>
.MarqueeArtistNames {
  @include side-gradation($g-footer-background-color, 8px);

  font-size: 0.8em;
  line-height: 1.5em;
  padding: 0 0.5em;
  white-space: nowrap;
  position: relative;

  & > * {
    display: inline-block;
  }
}
</style>

<style lang="scss">
@include marquee-animation();
</style>
