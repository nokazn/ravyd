<template>
  <portal to="snackbar">
    <v-snackbar
      v-model="snackbar"
      :color="type"
      top
      :class="$style.Snackbar"
    >
      {{ message }}

      <template #action="{ attrs }">
        <v-btn
          icon
          v-bind="attrs"
          @click="snackbar = false"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </portal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

const ON_CHANGED = 'on-changed';

export type On = {
  [ON_CHANGED]: boolean
}

export type SnackbarType = 'primary' | 'accent' | 'secondary' | 'info' | 'warning' | 'error' | 'success' | undefined

export default Vue.extend({
  props: {
    isShown: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String as PropType<SnackbarType>,
      default: undefined,
    },
    message: {
      type: String,
      required: true,
    },
  },

  computed: {
    snackbar: {
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
.Snackbar {
  z-index: z-index-of(snackbar) !important;
}
</style>
