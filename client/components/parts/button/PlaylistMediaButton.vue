<template>
  <CircleButton
    :size="size"
    :outlined="outlined"
    :disabled="disabled"
    :title="mediaButton.title"
    @click="onClicked"
  >
    {{ mediaButton.icon }}
  </CircleButton>
</template>

<script lang="ts">
import Vue from 'vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';

export type MediaButton = {
  icon: 'mdi-play' | 'mdi-pause' | 'mdi-volume-high'
  title: '再生' | '停止' | '再生中' | '再生できない項目'
}

const INPUT = 'input';

export type On = {
  [INPUT]: void;
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
    size: {
      type: Number,
      default: 36,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    mediaButton(): MediaButton {
      if (this.disabled) {
        return {
          icon: 'mdi-play',
          title: '再生できない項目',
        };
      }
      if (!this.value) {
        return {
          icon: 'mdi-play',
          title: '再生',
        };
      }
      return {
        icon: 'mdi-pause',
        title: '停止',
      };
    },
  },

  methods: {
    onClicked() {
      this.$emit(INPUT);
    },
  },
});
</script>
