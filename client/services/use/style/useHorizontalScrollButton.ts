import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  SetupContext,
  Ref,
} from '@vue/composition-api';
import { debounce } from 'lodash';
import { useIntersectionObserver } from '~/services/use/observer';

type Card = {
  isVisible: boolean;
  element: HTMLDivElement;
}

// variables.scss の $g-gradation-width
const gradationWidth = (width: number): number => {
  if (typeof window !== 'undefined') {
    return Math.min((width * 1.5) / 100, 16);
  }
  return 0;
};

export const useHorizontalScrollButton = (
  root: SetupContext['root'],
  containerRef: Ref<HTMLElement | undefined | null>,
) => {
  const scrollableWidth = ref(0);
  const scrollLeft = ref(0);
  const cardList = ref<Card[]>([]);

  const isScrollOnLeftEdge = computed(() => scrollLeft.value === 0);
  // 小数点を丸めてる影響で超えることもある
  const isScrollOnRightEdge = computed(() => scrollLeft.value >= scrollableWidth.value);

  // 100ms 毎に横方向のスクロールイベントを監視
  const scrollEventListener = debounce((e: Event) => {
    const element = e.target as HTMLDivElement;
    scrollLeft.value = Math.ceil(element.scrollLeft);
  }, 100);

  onMounted(() => {
    const container = containerRef.value;
    if (container == null) return;

    scrollableWidth.value = container.scrollWidth - container.clientWidth;
    scrollLeft.value = container.scrollLeft;
    container.addEventListener('scroll', scrollEventListener);

    // n 番目のカード要素の表示/非表示を監視
    Array.from(container.children).forEach((card, index) => {
      useIntersectionObserver(ref(card), (entry) => {
        const target = entry.target as HTMLDivElement;
        cardList.value[index] = {
          isVisible: entry.isIntersecting,
          element: target,
        };
      }, {
        threshold: [0, 1],
      });
    });
  });

  onBeforeUnmount(() => {
    const container = containerRef.value;
    if (container != null) {
      container.removeEventListener('scroll', scrollEventListener);
    }
  });

  const onLeftButtonClicked = () => {
    const container = containerRef.value;
    if (container == null) return;

    const sidePadding = gradationWidth(root.$screen.width);
    // ラッパーの右端の right - 余白
    const rightSideEdgeRight = container.getBoundingClientRect().right - sidePadding;
    // 表示されている一番左端のカードの right
    const leftSideElementRight = cardList.value
      .find((element) => element.isVisible)
      ?.element
      .getBoundingClientRect().right;
    if (leftSideElementRight == null) return;

    // 表示されている一番左端のカードを右端までスクロールさせる
    container.scrollBy({
      left: leftSideElementRight - rightSideEdgeRight,
      behavior: 'smooth',
    });
  };

  const onRightButtonClicked = () => {
    const container = containerRef.value;
    if (container == null) return;

    const sidePadding = gradationWidth(root.$screen.width);
    // ラッパーの左端の left ⁺ 余白
    const leftSideEdgeLeft = container.getBoundingClientRect().left + sidePadding;

    // 表示されている一番右端のカードの left
    const getRightSideElementLeft = (): number | undefined => {
      const { length } = cardList.value;
      if (length === 0) return undefined;
      // 末尾からたどっていき、初めて true になるカード
      for (let i = length - 1; i > 0; i -= 1) {
        const card = cardList.value[i];
        if (card.isVisible) {
          return card.element.getBoundingClientRect().left;
        }
      }
      return undefined;
    };

    const rightSideElementLeft = getRightSideElementLeft();
    if (rightSideElementLeft == null) return;

    container.scrollBy({
      left: rightSideElementLeft - leftSideEdgeLeft,
      behavior: 'smooth',
    });
  };

  return {
    isScrollOnLeftEdge,
    isScrollOnRightEdge,
    onLeftButtonClicked,
    onRightButtonClicked,
  };
};
