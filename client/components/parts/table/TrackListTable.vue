<template>
  <v-data-table
    :headers="headers"
    :items="items"
    disable-pagination
    disable-sort
    hide-default-footer>
    <template #item.like="{ item: { like } }">
      <v-btn
        icon
        size="small">
        <v-icon :size="16">
          {{ likeIcon(like) }}
        </v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { DataTableHeader } from 'vuetify';
import { SpotifyAPI } from '~~/types';

export type Data = {
  headers: DataTableHeader[]
  items: {
    id: number
    name: string
    like: boolean
  }[]
};

export default Vue.extend({
  props: {
    trackList: {
      type: Array as PropType<SpotifyAPI.SimpleAlbum[]>,
      required: true,
    },
  },

  data(): Data {
    const headers = [
      {
        text: '#',
        value: 'id',
        width: 24,
      },
      {
        text: ' ',
        value: 'like',
        width: 24,
      },
      {
        text: 'タイトル',
        value: 'name',
      },
    ];

    const items = this.trackList.map((track, i) => ({
      id: i + 1,
      name: track.name,
      // @todo
      like: false,
    }));

    return {
      headers,
      items,
    };
  },

  computed: {
    likeIcon(): (isLiked: boolean) => string {
      return (isLiked: boolean) => (isLiked
        ? 'mdi-heart'
        : 'mdi-heart-outline');
    },
  },
});
</script>
