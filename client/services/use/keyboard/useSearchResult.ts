import {
  onMounted,
  onBeforeUnmount,
  computed,
  ref,
  watch,
  SetupContext,
  ComputedRef,
} from '@vue/composition-api';
import { RawLocation } from 'vue-router';
import { $searchForm } from '~/observable/searchForm';
import { App } from '~~/types';

const key = 'searchResult';

export const useSearchResult = (
  root: SetupContext['root'],
  itemList: ComputedRef<App.ContentItem[]>,
) => {
  const selectedItemIndex = ref<number>();

  const query = computed(() => $searchForm.query);
  const isSearching = computed(() => $searchForm.isSearching);

  const menu = computed<boolean>({
    get() { return $searchForm.menu; },
    set(value) { $searchForm.handleMenu(value); },
  });

  const selectedItem = computed<App.ContentItem | undefined>(() => {
    return selectedItemIndex.value != null
      ? itemList.value[selectedItemIndex.value] ?? undefined
      : undefined;
  });

  const onItemClicked = () => { menu.value = false; };
  const handleSelectedItem = (diff: 1 | -1) => {
    const { length } = itemList.value;
    // 未選択の場合は down/up を押したときにそれぞれ 最初/最後 が選択されるようにする
    const currentIndex = selectedItemIndex.value ?? (diff > 0 ? -1 : 0);
    selectedItemIndex.value = (currentIndex + diff + length) % length;
  };
  const onItemEntered = (to: RawLocation) => {
    root.$router.push(to);
    menu.value = false;
  };

  watch(query, () => {
    // 検索用のクエリが変化するたびに初期化
    selectedItemIndex.value = undefined;
  });

  onMounted(() => {
    root.$keyboard.add(key, (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          handleSelectedItem(1);
          break;
        case 'ArrowUp':
          handleSelectedItem(-1);
          break;
        case 'Enter':
          // 項目が選択されていたらページ遷移
          if (selectedItem.value != null) {
            onItemEntered(selectedItem.value.to);
          }
          break;
        default:
          break;
      }
    });
  });

  const stop = () => { root.$keyboard.remove(key); };

  onBeforeUnmount(() => {
    stop();
  });

  return {
    selectedItemIndex,
    query,
    isSearching,
    selectedItem,
    menu,
    onItemClicked,
  };
};
