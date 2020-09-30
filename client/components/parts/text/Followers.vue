<template>
  <span
    :title="text"
    :class="{ ['subtext--text']: subtext }"
  >
    <v-icon
      v-if="!hideIcon"
      :size="size * 1.25"
      :color="subtext ? 'subtext' : undefined"
    >
      mdi-account-multiple
    </v-icon>

    <span :style="textStyles">
      {{ text }}
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

type Data = {
  textStyles: { fontSize: string }
}

export default Vue.extend({
  props: {
    text: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 14,
    },
    hideIcon: {
      type: Boolean,
      default: false,
    },
    subtext: {
      type: Boolean,
      default: false,
    },
  },

  data(): Data {
    const textStyles = { fontSize: `${this.size}px` };

    return {
      textStyles,
    };
  },
});
</script>
