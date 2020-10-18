<template>
  <v-list-item
    dense
    :color="color"
    :nuxt="!isTwoLine"
    :to="isTwoLine ? undefined : item.to"
    :title="item.name"
    :data-is-selected="selected"
    :class="$style.ContentListItem"
    @click="onClick"
  >
    <v-list-item-avatar
      tile
      :class="$style.ContentListItem__avatar"
    >
      <UserAvatar
        v-if="item.type === 'artist'"
        small-icon
        type="artist"
        :size="40"
        :src="artworkSrc"
        :alt="item.name"
        :title="item.name"
        default-user-icon="mdi-account-music"
      />
      <ReleaseArtwork
        v-else
        :size="40"
        :src="artworkSrc"
        :alt="item.name"
        :title="item.name"
      />
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title class="g-ellipsis-text">
        <nuxt-link
          :to="item.to"
          @click.native.stop
        >
          {{ item.name }}
        </nuxt-link>
      </v-list-item-title>

      <v-list-item-subtitle v-if="isTwoLine">
        <ArtistNames
          ellipsis
          :artists="item.artists"
        />
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';

import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import UserAvatar from '~/components/parts/image/UserAvatar.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import { getImageSrc } from '~/utils/image';
import { App } from '~~/types';

const CLICK = 'click';

export type On = {
  [CLICK]: void;
}

export default defineComponent({
  components: {
    ReleaseArtwork,
    UserAvatar,
    ArtistNames,
  },

  props: {
    item: {
      type: Object as PropType<App.ContentItemInfo>,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
  },

  emits: {
    [CLICK]: null,
  },

  setup(props, { emit, root }) {
    const isTwoLine = computed(() => props.item.artists != null);
    const artworkSrc = computed(() => getImageSrc(
      props.item.images,
      root.$constant.TRACK_LIST_ARTWORK_SIZE,
    ));
    const onClick = () => {
      if (isTwoLine) {
        root.$router.push(props.item.to);
      }
      emit(CLICK);
    };

    return {
      isTwoLine,
      artworkSrc,
      onClick,
    };
  },
});
</script>

<style lang="scss" module>
.ContentListItem {
  &[data-is-selected=true] {
    background-color: lighten($g-menu-background-color, 16%);
  }

  &__avatar {
    margin-top: 6px !important;
    margin-bottom: 6px !important;
  }
}
</style>
