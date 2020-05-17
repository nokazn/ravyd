<template>
  <v-hover #default="{ hover: isRowHovered }">
    <tr :class="$style.TrackListTableRow">
      <td
        :class="[
          $style.TrackListTableRow__id,
          'text-center'
        ]">
        <v-btn
          v-if="isRowHovered"
          outlined
          small
          icon>
          <v-icon>
            {{ mediaButtonIcon }}
          </v-icon>
        </v-btn>
        <v-icon v-else-if="isPlayingTrack">
          mdi-volume-high
        </v-icon>
        <span v-else>
          {{ item.index }}
        </span>
      </td>

      <td>
        <v-btn
          icon
          size="small">
          <v-icon :size="18">
            {{ likeIcon(item.like) }}
          </v-icon>
        </v-btn>
      </td>

      <td
        :class="$style.TrackListTableRow__name"
        :data-is-track-set="isTrackSet">
        {{ item.name }}
      </td>
    </tr>
  </v-hover>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export type RowItem = {
  index: number
  like: boolean
  name: string
  id: string
  uri: string
}

export default Vue.extend({
  props: {
    item: {
      type: Object as PropType<RowItem>,
      required: true,
    },
    isTrackSet: {
      type: Boolean,
      required: true,
    },
    isPlayingTrack: {
      type: Boolean,
      required: true,
    },
    mediaButtonIcon: {
      type: String as PropType<'mdi-play' | 'mdi-heart-outline'>,
      required: true,
    },
  },

  computed: {
    likeIcon(): (isLiked: boolean) => 'mdi-heart' | 'mdi-heart-outline' {
      return (isLiked: boolean) => (isLiked
        ? 'mdi-heart'
        : 'mdi-heart-outline');
    },
  },
});
</script>

<style lang="scss" module>
.TrackListTableRow {
  &__id {
    width: 60px;
  }
  &__name[data-is-track-set=true] {
    color: #00E5FF;
  }
}
</style>

<style lang="scss">
tr {
  cursor: pointer;
  td {
    padding: 0 12px;
  }
}
</style>
