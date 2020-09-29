<template>
  <span
    :title="title"
    :class="{ ['subtext--text']: subtext }"
  >
    <v-icon
      v-if="!hideIcon"
      :size="size * 1.25"
      :color="subtext ? 'subtext' : undefined"
    >
      mdi-album
    </v-icon>
    <span :style="textStyles">
      {{ label }}
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

export type Data = {
  title: string
  textStyles: { fontSize: string }
}

export default Vue.extend({
  props: {
    label: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 12,
    },
    subtext: {
      type: Boolean,
      default: false,
    },
    hideIcon: {
      type: Boolean,
      default: false,
    },
  },

  data(): Data {
    const title = `レーベル - ${this.label}`;
    const textStyles = { fontSize: `${this.size}px` };
    return {
      title,
      textStyles,
    };
  },
});
</script>
