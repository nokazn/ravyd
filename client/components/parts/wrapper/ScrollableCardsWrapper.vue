<template>
  <v-hover #default="{ hover }">
    <div>
      <div :class="$style.CardsWrapper">
        <transition name="fade">
          <v-btn
            v-show="hover && !isScrollOnLeftEdge"
            icon
            large
            :class="[
              $style.CardsWrapper__icon,
              $style['CardsWrapper__icon--left']
            ]"
            @click="onLeftButtonClicked"
          >
            <v-icon :size="48">
              mdi-chevron-left
            </v-icon>
          </v-btn>
        </transition>

        <transition name="fade">
          <v-btn
            v-show="hover && !isScrollOnRightEdge"
            icon
            absolute
            large
            :class="[
              $style.CardsWrapper__icon,
              $style['CardsWrapper__icon--right']
            ]"
            @click="onRightButtonClicked"
          >
            <v-icon :size="48">
              mdi-chevron-right
            </v-icon>
          </v-btn>
        </transition>

        <div
          ref="cardsWrapper"
          :class="[
            $style.CardsWrapper__container,
            'g-no-scroll-bar'
          ]"
        >
          <slot />
        </div>
      </div>
    </div>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue';
import debounce from 'lodash/debounce';

export { ReleaseCardInfo } from '~/components/containers/card/ReleaseCard.vue';
export { ArtistCardInfo } from '~/components/containers/card/ArtistCard.vue';

const CARDS_WRAPPER_MARGIN = 24;

export type Data = {
  cardList: {
    isVisible: boolean
    element: HTMLDivElement
  }[],
  scrollMax: number
  scrollLeft: number
}

export type CardType = 'release' | 'artist'

export default Vue.extend({
  data(): Data {
    return {
      cardList: [],
      scrollMax: 0,
      scrollLeft: 0,
    };
  },

  computed: {
    isScrollOnLeftEdge(): boolean {
      return this.scrollLeft === 0;
    },
    isScrollOnRightEdge(): boolean {
      return this.scrollLeft === this.scrollMax;
    },
  },

  mounted() {
    const cardsWrapperRef = this.$refs.cardsWrapper as HTMLDivElement;
    if (cardsWrapperRef == null) {
      console.warn('Cannot find the ref of "cardsWrapperRef".');
      return;
    }

    this.scrollMax = cardsWrapperRef.scrollWidth - cardsWrapperRef.clientWidth;
    this.scrollLeft = cardsWrapperRef.scrollLeft;

    const observer = (index: number) => new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLDivElement;
        this.cardList[index] = {
          isVisible: entry.isIntersecting,
          element: target,
        };
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
      const leftSideElementRight = this.cardList
        .find((element) => element.isVisible)!.element.getBoundingClientRect().right;
      const cardsWrapperRef = this.$refs.cardsWrapper as HTMLDivElement;
      // ラッパーの右端の絶対位置 - 余白
      const rightSideEdgeRight = cardsWrapperRef
        .getBoundingClientRect().right - CARDS_WRAPPER_MARGIN;

      cardsWrapperRef.scrollBy({
        left: leftSideElementRight - rightSideEdgeRight,
        behavior: 'smooth',
      });
    },
    onRightButtonClicked() {
      const rightSideElementLeft = () => {
        const { length } = this.cardList;
        let previousIsVisible: boolean = false;
        for (let i = 0; i < length; i += 1) {
          // true -> false に変わるところ
          if (previousIsVisible && !this.cardList[i].isVisible) {
            return this.cardList[i - 1].element.getBoundingClientRect().left;
          }
          previousIsVisible = this.cardList[i].isVisible;
        }
        return this.cardList[length - 1].element.getBoundingClientRect().left;
      };

      const cardsWrapperRef = this.$refs.cardsWrapper as HTMLDivElement;
      // ラッパーの左端の絶対位置 ⁺ 余白
      const leftSideEdgeLeft = cardsWrapperRef
        .getBoundingClientRect().left + CARDS_WRAPPER_MARGIN;
      cardsWrapperRef.scrollBy({
        left: rightSideElementLeft() - leftSideEdgeLeft,
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
      margin-right: 32px;
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
