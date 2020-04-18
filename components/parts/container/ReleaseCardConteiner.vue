<template>
  <v-hover #default="{ hover }">
    <div :class="$style.ReleaseCardContainer">
      <transition>
        <v-btn
          v-show="hover"
          icon
          x-large
          :class="[
            $style.ReleaseCardContainer__icon,
            $style['ReleaseCardContainer__icon--left']
          ]">
          <v-icon :size="48">
            mdi-chevron-left
          </v-icon>
        </v-btn>
      </transition>

      <transition>
        <v-btn
          v-show="hover"
          icon
          absolute
          x-large
          :class="[
            $style.ReleaseCardContainer__icon,
            $style['ReleaseCardContainer__icon--right']
          ]">
          <v-icon :size="48">
            mdi-chevron-right
          </v-icon>
        </v-btn>
      </transition>

      <div
        :class="[
          $style.ReleaseCardContainer__container,
          'g-no-scroll-bar'
        ]">
        <slot />
      </div>
    </div>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style lang="scss" module>
.ReleaseCardContainer {
  position: relative;
  &__icon {
    // 親に position: relative 以外が指定されている場合は親要素が基準になる
    position: absolute;
    top: 45%;
    transform: translateY(-50%);
    z-index: z-index-of(floating-button);
    &--left {
      left: 8px;
    }
    &--right {
      right: 8px;
    }
  }
  &__container {
    display: flex;
    overflow-x: auto;
    padding: 0 32px;
    & > *:not(:last-child) {
      margin-right: 16px;
    }
    & > *:last-child {
      padding-right: 32px;
    }
  }
}
</style>
