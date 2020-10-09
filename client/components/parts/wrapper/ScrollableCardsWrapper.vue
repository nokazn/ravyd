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
      :ref="CONTAINER_REF"
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
import Vue, { PropType } from 'vue';
import { debounce } from 'lodash';
import CircleButton from '~/components/parts/button/CircleButton.vue';

const CONTAINER_REF = 'CONTAINER_REF';

// variables.scss の $g-gradation-width
const gradationWidth = (width: number): number => {
  if (typeof window !== 'undefined') {
    return Math.min((width * 1.5) / 100, 16);
  }
  return 0;
};

type Card = {
  isVisible: boolean;
  element: HTMLDivElement;
}

type Data = {
  cardList: Card[];
  scrollableWidth: number;
  scrollLeft: number;
  CONTAINER_REF: string;
}

export default Vue.extend({
  components: {
    CircleButton,
  },

  props: {
    margin: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
  },

  data(): Data {
    return {
      cardList: [],
      scrollableWidth: 0,
      scrollLeft: 0,
      CONTAINER_REF,
    };
  },

  computed: {
    cssProps(): { [k: string]: string } {
      const margin = this.margin ?? Math.floor(this.$screen.cardWidth / 12);
      return {
        '--margin-right': `${margin}px`,
      };
    },
    isScrollOnLeftEdge(): boolean {
      return this.scrollLeft === 0;
    },
    isScrollOnRightEdge(): boolean {
      // 小数点を丸めてる影響で超えることもある
      return this.scrollLeft >= this.scrollableWidth;
    },
  },

  mounted() {
    const containerRef = this.$refs[CONTAINER_REF] as HTMLDivElement;
    if (containerRef == null && process.env.NODE_ENV === 'development') {
      console.warn(`Cannot find the ref of "${CONTAINER_REF}".`);
      return;
    }

    this.scrollableWidth = containerRef.scrollWidth - containerRef.clientWidth;
    this.scrollLeft = containerRef.scrollLeft;

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
    // n 番目のカード要素の表示/非表示を監視
    Array.from(containerRef.children).forEach((ele, index) => {
      observer(index).observe(ele);
    });

    // 100ms 毎に横方向のスクロールイベントを監視
    const interval = 100;
    containerRef.addEventListener('scroll', debounce((e) => {
      const element = e.target as HTMLDivElement;
      this.scrollLeft = Math.ceil(element.scrollLeft);
    }, interval));
  },

  methods: {
    onLeftButtonClicked() {
      const containerRef = this.$refs[CONTAINER_REF] as HTMLDivElement | null;
      if (containerRef == null) return;

      const sidePadding = gradationWidth(this.$screen.width);
      // ラッパーの右端の right - 余白
      const rightSideEdgeRight = containerRef
        .getBoundingClientRect().right - sidePadding;

      // 表示されている一番左端のカードの right
      const leftSideElementRight = this.cardList
        .find((element) => element.isVisible)?.element.getBoundingClientRect().right;
      if (leftSideElementRight == null) return;

      // 表示されている一番左端のカードを右端までスクロールさせる
      containerRef.scrollBy({
        left: leftSideElementRight - rightSideEdgeRight,
        behavior: 'smooth',
      });
    },
    onRightButtonClicked() {
      const containerRef = this.$refs[CONTAINER_REF] as HTMLDivElement | null;
      if (containerRef == null) return;

      const sidePadding = gradationWidth(this.$screen.width);
      // ラッパーの左端の left ⁺ 余白
      const leftSideEdgeLeft = containerRef
        .getBoundingClientRect().left + sidePadding;

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

      containerRef.scrollBy({
        left: rightSideElementLeft - leftSideEdgeLeft,
        behavior: 'smooth',
      });
    },
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
    display: block;
    position: absolute;
    top: 0;
    // @todo 少しはみでてしまうのを調整している
    left: -1px;
    height: 100%;
    width: $g-gradation-width;
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
    // @todo 少しはみでてしまうのを調整している
    right: -1px;
    height: 100%;
    width: $g-gradation-width;
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
