<template>
  <div
    :class="{
      [$style.Fallback]: true,
      [$style.Pad]: !padless,
    }"
  >
    <div :class="$style.Fallback__wrapper">
      <div :class="$style.Fallback__title">
        <v-icon left>
          mdi-alert-circle-outline
        </v-icon>
        <slot />
      </div>

      <v-btn
        rounded
        @click="reload"
      >
        <v-icon left>
          mdi-reload
        </v-icon>
        再読み込み
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    padless: {
      type: Boolean,
      default: false,
    },
  },

  setup(_, { root }) {
    const reload = () => { root.$router.go(0); };
    return { reload };
  },
});
</script>

<style lang="scss" module>
.Fallback {
  height: 100%;

  &__wrapper {
    & > *:not(:last-child) {
      margin-bottom: 0.75em;
    }
  }

  &__title {
    font-size: 1.25em;
  }
}

.Pad {
  padding: 1em 2em;
}
</style>
