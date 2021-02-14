<template>
  <td :colspan="colspan">
    <v-icon
      color="subtext"
      :size="16"
    >
      mdi-album
    </v-icon>
    <span class="subtext--text">
      {{ discNumber }}
    </span>
  </td>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    discNumber: {
      type: Number,
      required: true,
    },
    colspan: {
      type: Number,
      required: true,
    },
  },
});
</script>
