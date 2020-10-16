<template>
  <span :class="$style.TrackListMediaButton">
    <template v-if="!disabled">
      <CircleButton
        v-show="hover"
        outlined
        :size="size"
        :icon-size="iconSize"
        :title="mediaButton.title"
        @click="onClicked"
      >
        {{ mediaButton.icon }}
      </CircleButton>
      <v-icon
        v-show="!hover && value"
        :size="iconSize"
        title="再生中"
      >
        mdi-volume-high
      </v-icon>
      <span v-show="!hover && !value">
        {{ trackNumber }}
      </span>
    </template>

    <span
      v-else
      title="再生できない項目"
      class="inactive--text"
    >
      {{ trackNumber }}
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';

export type MediaButton = {
  icon: 'mdi-play' | 'mdi-pause';
  title: '再生' | '停止';
}

const INPUT = 'input';

export type On = {
  [INPUT]: boolean;
}

export default Vue.extend({
  components: {
    CircleButton,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    hover: {
      type: Boolean,
      required: true,
    },
    trackNumber: {
      type: Number,
      default: undefined,
    },
    size: {
      type: Number,
      default: 28,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    mediaButton(): MediaButton {
      return this.value
        ? {
          icon: 'mdi-pause',
          title: '停止',
        }
        : {
          icon: 'mdi-play',
          title: '再生',
        };
    },
    iconSize(): number {
      return Math.floor(this.size * 0.9);
    },
  },

  methods: {
    onClicked() {
      this.$emit(INPUT, !this.value);
    },
  },
});
</script>

<style lang="scss" module>
.TrackListMediaButton {
  display: inline-flex;
  justify-content: center;
  min-width: 28px;
}
</style>
