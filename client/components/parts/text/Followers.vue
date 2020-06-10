<template>
  <span
    :title="text"
    class="subtext--text"
  >
    <v-icon
      :size="size"
      color="subtext"
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

export type Data = {
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
      default: 16,
    },
  },

  data(): Data {
    const textStyles = {
      fontSize: `${this.size * 0.8}px`,
    };

    return {
      textStyles,
    };
  },
});
</script>
