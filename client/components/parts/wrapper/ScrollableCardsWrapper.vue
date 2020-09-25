<template>
  <div
    :class="$style.CardsWrapper"
    :style="cssProps"
  >
    <transition name="fade">
      <v-btn
        v-show="!isScrollOnLeftEdge"
        icon
        absolute
        large
        :class="[
          $style.CardsWrapper__icon,
          $style['CardsWrapper__icon--left']
        ]"
        @click="onLeftButtonClicked"
      >
        <v-icon :size="40">
          mdi-chevron-left
        </v-icon>
      </v-btn>
    </transition>

    <transition name="fade">
      <v-btn
        v-show="!isScrollOnRightEdge"
        icon
        absolute
        large
        :class="[
          $style.CardsWrapper__icon,
          $style['CardsWrapper__icon--right']
        ]"
        @click="onRightButtonClicked"
      >
        <v-icon :size="40">
          mdi-chevron-right
        </v-icon>
      </v-btn>
    </transition>

    <div
      :ref="SCROLLABLE_CARDS_WRAPPER_REF"
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
import Vue from 'vue';
import { debounce } from 'lodash';

const CARDS_WRAPPER_MARGIN = 24;
const SCROLLABLE_CARDS_WRAPPER_REF = 'SCROLLABLE_CARDS_WRAPPER_REF';

type Data = {
  cardList: {
    isVisible: boolean
    element: HTMLDivElement
  }[],
  scrollableWidth: number
  scrollLeft: number
  SCROLLABLE_CARDS_WRAPPER_REF: string
}

export default Vue.extend({
  props: {
    margin: {
      type: Number,
      default: 24,
    },
  },

  data(): Data {
    return {
      cardList: [],
      scrollableWidth: 0,
      scrollLeft: 0,
      SCROLLABLE_CARDS_WRAPPER_REF,
    };
  },

  computed: {
    cssProps(): { [k: string]: string } {
      return {
        '--margin-right': `${this.margin}px`,
      };
    },
    isScrollOnLeftEdge(): boolean {
      return this.scrollLeft === 0;
    },
    isScrollOnRightEdge(): boolean {
      return this.scrollLeft === this.scrollableWidth;
    },
  },

  mounted() {
    const cardsWrapperRef = this.$refs[SCROLLABLE_CARDS_WRAPPER_REF] as HTMLDivElement;
    if (cardsWrapperRef == null) {
      console.warn('Cannot find the ref of "CARDS_WRAPPER_REF".');
      return;
    }

    this.scrollableWidth = cardsWrapperRef.scrollWidth - cardsWrapperRef.clientWidth;
    this.scrollLeft = cardsWrapperRef.scrollLeft;

    const observer = (index: number) => new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLDivElement;
        const { cardList } = this;
        cardList[index] = {
          isVisible: entry.isIntersecting,
          element: target,
        };
        this.cardList = cardList;
      }, {
        threshold: [0, 1],
      });
    });
    // それぞれのカード要素の表示/非表示を監視
    Array.from(cardsWrapperRef.children).forEach((ele, index) => {
      observer(index).observe(ele);
    });

    // 100ms 毎に横方向のスクロールイベントを監視
    cardsWrapperRef.addEventListener('scroll', debounce((e) => {
      const element = e.target as HTMLDivElement;
      this.scrollLeft = Math.ceil(element.scrollLeft);
    }, 100));
  },

  methods: {
    onLeftButtonClicked() {
      const cardsWrapperRef = this.$refs[SCROLLABLE_CARDS_WRAPPER_REF] as HTMLDivElement | null;
      if (cardsWrapperRef == null) return;

      // ラッパーの右端の right - 余白
      const rightSideEdgeRight = cardsWrapperRef
        .getBoundingClientRect().right - CARDS_WRAPPER_MARGIN;

      // 表示されている一番左端のカードの right
      const leftSideElementRight = this.cardList
        .find((element) => element.isVisible)?.element.getBoundingClientRect().right;
      if (leftSideElementRight == null) return;

      // 表示されている一番左端のカードを右端までスクロールさせる
      cardsWrapperRef.scrollBy({
        left: leftSideElementRight - rightSideEdgeRight,
        behavior: 'smooth',
      });
    },
    onRightButtonClicked() {
      const cardsWrapperRef = this.$refs[SCROLLABLE_CARDS_WRAPPER_REF] as HTMLDivElement | null;
      if (cardsWrapperRef == null) return;

      // ラッパーの左端の left ⁺ 余白
      const leftSideEdgeLeft = cardsWrapperRef
        .getBoundingClientRect().left + CARDS_WRAPPER_MARGIN;

      // 表示されている一番右端のカードの left
      const getRightSideElementLeft = (): number | undefined => {
        const { length } = this.cardList;
        if (length === 0) return undefined;

        // 末尾からたどっていき、初めて true になるカード
        for (let i = length - 1; i > 0; i -= 1) {
          const card = this.cardList[i];
          if (card.isVisible) {
            return card.element.getBoundingClientRect().left;
          }
        }
        return undefined;
      };
      const rightSideElementLeft = getRightSideElementLeft();
      if (rightSideElementLeft == null) return;

      cardsWrapperRef.scrollBy({
        left: rightSideElementLeft - leftSideEdgeLeft,
        behavior: 'smooth',
      });
    },
  },
});
</script>

<style lang="scss" module>
$total-side-padding: 40px;
$gradation-width: 24px;

.CardsWrapper {
  margin: 0 ($total-side-padding - $gradation-width);
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
      margin-right: var(--margin-right);
    }
  }

  // 左のグラデーション
  &::before {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: $gradation-width;
    content: "";
    background-image:
      linear-gradient(
        to right,
        rgba($g-background-color, 1),
        rgba($g-background-color, 0),
      );
    z-index: z-index-of(text-gradation);
  }

  // 右のグラデーション
  &::after {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: $gradation-width;
    content: "";
    background-image:
      linear-gradient(
        to left,
        rgba($g-background-color, 1),
        rgba($g-background-color, 0),
      );
    z-index: z-index-of(text-gradation);
  }
}
</style>

<style lang="scss" scoped>
@include fade-transition(0.3);
</style>
