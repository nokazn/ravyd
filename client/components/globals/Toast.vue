<template>
  <v-snackbar
    v-model="toast"
    :color="type"
    top
    :class="$style.Toast"
  >
    {{ message }}

    <template #action="{ attrs }">
      <v-btn
        icon
        v-bind="attrs"
        @click="toast = false"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue';

const ON_CHANGED = 'on-changed';

export type On = {
  [ON_CHANGED]: boolean
}

export default Vue.extend({
  props: {
    isShown: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      default: undefined,
    },
    message: {
      type: String,
      required: true,
    },
  },

  computed: {
    toast: {
      get(): boolean {
        return this.isShown;
      },
      set(isShown: boolean) {
        this.$emit(ON_CHANGED, isShown);
      },
    },
  },
});
</script>

<style lang="scss" module>
.Toast {
  z-index: z-index-of(toast) !important;
}
</style>
