<template>
  <div :class="$style.Fallback">
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
import Vue from 'vue';

export default Vue.extend({
  methods: {
    reload() {
      this.$router.go(0);
    },
  },
});
</script>

<style lang="scss" module>
.Fallback {
  height: calc(100vh - #{$g-header-height} - #{$g-footer-height});
  padding: 1em 2em;

  &__wrapper {
    & > *:not(:last-child) {
      margin-bottom: 0.75em;
    }
  }

  &__title {
    font-size: 1.25em;
  }
}
</style>
