<template>
  <OptionMenu
    offset-x
    :left="left"
    :right="right"
    :nudge-left="1"
    open-on-hover
  >
    <template #activator="{ on }">
      <ChildOptionMenuActivator :on="on">
        アーティストページに移動
      </ChildOptionMenuActivator>
    </template>

    <v-list-item-group>
      <v-list-item
        v-for="item in menuItemList"
        :key="item.to"
        nuxt
        :to="item.to"
        :disabled="item.disabled"
        :inactive="item.disabled"
      >
        <v-list-item-title>
          {{ item.name }}
        </v-list-item-title>
      </v-list-item>
    </v-list-item-group>
  </OptionMenu>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import OptionMenu from '~/components/parts/menu/OptionMenu.vue';
import ChildOptionMenuActivator from '~/components/parts/menu/ChildOptionMenuActivator.vue';
import { App } from '~~/types';

type MenuItem = {
  name: string;
  to: string;
  disabled: boolean;
}

export type Props = {
  artists: App.MinimumArtist[];
  left?: boolean;
  right?: boolean;
}

export default defineComponent({
  components: {
    OptionMenu,
    ChildOptionMenuActivator,
  },

  props: {
    artists: {
      type: Array as PropType<App.MinimumArtist[]>,
      required: true,
    },
    left: {
      type: Boolean,
      default: false,
    },
    right: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { root }) {
    // artistId is consistent during lifecycle
    const { artistId } = root.$route.params;
    const menuItemList = computed<MenuItem[]>(() => props.artists.map((artist) => ({
      name: artist.name,
      to: `/artists/${artist.id}`,
      disabled: artist.id === artistId,
    })));

    return { menuItemList };
  },
});
</script>
