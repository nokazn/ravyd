<template>
  <div
    :title="name"
    :class="[$style.TrackName, 'g-text-gradation']"
  >
    <span
      ref="MARQUEE_TEXT_REF"
      :style="marqueeStyles"
      @mouseover="onHovered"
    >
      <nuxt-link
        v-if="trackPath != null"
        :to="trackPath"
      >
        {{ name }}
      </nuxt-link>
      <span v-else>
        {{ name }}
      </span>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  defineComponent,
  computed,
  ref,
  watch,
  PropType,
} from '@vue/composition-api';
import { RawLocation } from 'vue-router';
import { useMarqueeText } from '~/use/style';
import { SpotifyAPI } from '~~/types';

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
    releaseId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<SpotifyAPI.Player.PlayingType>,
      required: true,
    },
  },

  setup(props) {
    const MARQUEE_TEXT_REF = ref<Vue>();
    const trackPath = computed<RawLocation | undefined>(() => {
      switch (props.type) {
        case 'track':
          return {
            path: `/releases/${props.releaseId}`,
            query: { track: props.id },
          };
        case 'episode':
          return `/episodes/${props.id}`;
        default:
          return undefined;
      }
    });

    const {
      marqueeStyles,
      calculateWidth,
      onHovered,
      resetTimer,
    } = useMarqueeText(MARQUEE_TEXT_REF);

    watch(ref(props.releaseId), () => {
      resetTimer();
      calculateWidth();
    });

    return {
      trackPath,
      marqueeStyles,
      onHovered,
      MARQUEE_TEXT_REF,
    };
  },
});
</script>

<style lang="scss" module>
.TrackName {
  color: $g-title-color;
  font-size: 0.9em;
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
