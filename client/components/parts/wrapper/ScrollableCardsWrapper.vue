<template>
  <div
    :class="$style.CardsWrapper"
    :style="cssProps"
  >
    <transition name="fade">
      <CircleButton
        v-show="!isScrollOnLeftEdge"
        absolute
        :size="36"
        :icon-size="36"
        :class="[
          $style.CardsWrapper__icon,
          $style['CardsWrapper__icon--left']
        ]"
        @click="onLeftButtonClicked"
      >
        mdi-chevron-left
      </CircleButton>
    </transition>

    <transition name="fade">
      <CircleButton
        v-show="!isScrollOnRightEdge"
        absolute
        :size="36"
        :icon-size="36"
        :class="[
          $style.CardsWrapper__icon,
          $style['CardsWrapper__icon--right']
        ]"
        @click="onRightButtonClicked"
      >
        mdi-chevron-right
      </CircleButton>
    </transition>

    <div
      ref="CONTAINER_REF"
      :class="[
        $style.CardsWrapper__container,
        'g-no-scroll-bar'
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  PropType,
} from '@vue/composition-api';
import { useHorizontalScrollButton } from '~/services/use/style';
import CircleButton from '~/components/parts/button/CircleButton.vue';

export default defineComponent({
  components: {
    CircleButton,
  },

  props: {
    margin: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
  },

  setup(props, { root }) {
    const CONTAINER_REF = ref<HTMLDivElement>();
    const {
      isScrollOnLeftEdge,
      isScrollOnRightEdge,
      onLeftButtonClicked,
      onRightButtonClicked,
    } = useHorizontalScrollButton(root, CONTAINER_REF);

    const cssProps = computed(() => ({
      '--margin-right': `${props.margin ?? Math.floor(root.$screen.cardWidth / 12)}px`,
    }));

    return {
      CONTAINER_REF,
      cssProps,
      isScrollOnLeftEdge,
      isScrollOnRightEdge,
      onLeftButtonClicked,
      onRightButtonClicked,
    };
  },
});
</script>

<style lang="scss" module>
.CardsWrapper {
  position: relative;
  scroll-behavior: smooth;

  &__icon {
    // 親に position: relative 以外が指定されている場合は親要素が基準になる
    position: absolute;
    top: 45%;
    transform: translateY(-50%);
    z-index: z-index-of(floating-button);

    &--left {
      left: -0;
    }

    &--right {
      right: 0;
    }
  }

  &__container {
    display: flex;
    overflow-x: auto;
    padding: 0 $g-gradation-width;
    height: 100%;
    position: relative;
    // padding-right が効かないので、疑似要素で隙間を作る
    &::after {
      display: block;
      padding-right: $g-gradation-width;
      content: "";
    }

    & > *:not(:last-child) {
      margin-right: min(3%, var(--margin-right));
    }
  }

  // 左のグラデーション
  &::before {
    // to right
    @include edge-gradation(right);

    // @todo 少しはみでてしまうのを調整している
    left: -1px;
  }

  // 右のグラデーション
  &::after {
    // to left
    @include edge-gradation(left);

    // @todo 少しはみでてしまうのを調整している
    right: -1px;
  }
}
</style>

<style lang="scss" scoped>
@include fade-transition(0.3);
</style>
