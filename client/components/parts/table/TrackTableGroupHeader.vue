<template>
  <td :colspan="colspan">
    <v-icon
      color="subtext"
      :size="16"
    >
      mdi-album
    </v-icon>
    <span class="subtext--text">{{ discNumber }}</span>
  </td>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    discNumber: {
      type: String,
      required: true,
    },
    colspan: {
      type: Number,
      required: true,
    },
  },
});
</script>
