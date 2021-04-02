import {
  onMounted,
  onBeforeUnmount,
  computed,
  ref,
  watch,
  SetupContext,
  WritableComputedRef,
} from '@vue/composition-api';
import type { RawLocation } from 'vue-router';
import type { SpotifyAPI } from 'shared/types';
import type { App } from '~/entities';

type ItemMap = {
  title: string;
  items: App.ContentItem<SpotifyAPI.SearchType>[];
};

const key = 'SEARCH_RESULT';
const LIMIT_OF_SEARCH_ITEM = 4;

export const useSearchResult = (
  root: SetupContext['root'],
  query: WritableComputedRef<string>,
  menu: WritableComputedRef<boolean>,
) => {
  const itemMapList = computed<ItemMap[]>(() => {
    return [
      {
        title: '曲',
        items: root.$getters()['search/tracks'].slice(0, LIMIT_OF_SEARCH_ITEM),
      },
      {
        title: 'アーティスト',
        items: root.$getters()['search/artists'].slice(0, LIMIT_OF_SEARCH_ITEM),
      },
      {
        title: 'アルバム',
        items: root.$getters()['search/albums'].slice(0, LIMIT_OF_SEARCH_ITEM),
      },
      {
        title: 'プレイリスト',
        items: root.$getters()['search/playlists'].slice(0, LIMIT_OF_SEARCH_ITEM),
      },
      {
        title: 'ポッドキャスト',
        items: root.$getters()['search/shows'].slice(0, LIMIT_OF_SEARCH_ITEM),
      },
      {
        title: 'エピソード',
        items: root.$getters()['search/episodes'].slice(0, LIMIT_OF_SEARCH_ITEM),
      },
    ];
  });
  const itemList = computed<App.ContentItem[]>(() => itemMapList.value.reduce<App.ContentItem[]>(
    (prev, curr) => [...prev, ...curr.items],
    [],
  ));
  const hasItem = computed(() => itemList.value.length > 0);

  const selectedItemIndex = ref<number>();
  const selectedItem = computed<App.ContentItem | undefined>(() => {
    return selectedItemIndex.value != null
      ? itemList.value[selectedItemIndex.value] ?? undefined
      : undefined;
  });
  const isSelected = (id: string) => {
    return selectedItem.value != null
      ? id === selectedItem.value.id
      : false;
  };

  watch(query, () => {
    // 検索用のクエリが変化するたびに初期化
    selectedItemIndex.value = undefined;
  });

  const handleSelectedItem = (diff: 1 | -1) => {
    const { length } = itemList.value;
    // 未選択の場合は down/up を押したときにそれぞれ 最初/最後 が選択されるようにする
    const currentIndex = selectedItemIndex.value ?? (diff > 0 ? -1 : 0);
    selectedItemIndex.value = (currentIndex + diff + length) % length;
  };
  const onItemEntered = (to: RawLocation) => {
    root.$router.push(to);
    // TODO
    // eslint-disable-next-line no-param-reassign
    menu.value = false;
  };

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
    itemMapList,
    itemList,
    hasItem,
    isSelected,
    selectedItemIndex,
    selectedItem,
  };
};
