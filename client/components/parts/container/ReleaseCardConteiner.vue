<template>
  <v-hover #default="{ hover }">
    <div>
      <div :class="$style.ReleaseCardContainer">
        <transition name="fade">
          <v-btn
            v-show="hover"
            icon
            large
            :class="[
              $style.ReleaseCardContainer__icon,
              $style['ReleaseCardContainer__icon--left']
            ]">
            <v-icon :size="48">
              mdi-chevron-left
            </v-icon>
          </v-btn>
        </transition>

        <transition name="fade">
          <v-btn
            v-show="hover"
            icon
            absolute
            large
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
    </div>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style lang="scss" module>
$total-side-padding: 40px;
$gradation-width: 24px;
.ReleaseCardContainer {
  margin: 0 ($total-side-padding - $gradation-width);
  position: relative;
  &__icon {
    // 親に position: relative 以外が指定されている場合は親要素が基準になる
    position: absolute;
    top: 45%;
    transform: translateY(-50%);
    z-index: z-index-of(floating-button);
    &--left {
      left: -12px;
    }
    &--right {
      right: -12px;
    }
  }
  &__container {
    display: flex;
    overflow-x: auto;
    padding: 0 $gradation-width;
    height: 100%;
    position: relative;
    // padding-right が効かないので、疑似要素で隙間を作る
    &::after {
      display: block;
      padding-right: $gradation-width;
      content: "";
    }
    & > *:not(:last-child) {
      margin-right: 24px;
    }
  }

  // 左のグラデーション
  &::before{
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: $gradation-width;
    content: "";
    background-image: linear-gradient(
      to right,
      rgba($g-background-color, 1),
      rgba($g-background-color, 0),
    );
    z-index: z-index-of(text-gradation);
  }

  // 右のグラデーション
  &::after{
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: $gradation-width;
    content: "";
    background-image: linear-gradient(
      to left,
      rgba($g-background-color, 1),
      rgba($g-background-color, 0),
    );
    z-index: z-index-of(text-gradation);
  }
}
</style>

<style lang="scss" scoped>
@include fade-transition(.3);
</style>
