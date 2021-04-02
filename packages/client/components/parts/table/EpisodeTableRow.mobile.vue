<template>
  <tr
    :class="{
      [$style.EpisodeTableRow]: true,
      'inactive--text': !item.isPlayable
    }"
    @click="onRowClicked"
  >
    <td>
      <div :class="$style.Content">
        <div
          :title="item.name"
          :class="[$style.Content__title, titleColor]"
        >
          <span class="g-ellipsis-text">
            {{ item.name }}
          </span>
          <ExplicitChip v-if="item.explicit" />
        </div>

        <div
          :class="subtitleColor"
          class="g-ellipsis-text g-small-text"
          :title="item.description"
        >
          {{ item.description }}
        </div>
      </div>
    </td>

    <td>
      <EpisodeProgressBar
        :max-width="44"
        :resume-point="item.resumePoint"
        :duration-ms="item.durationMs"
      />
    </td>

    <td>
      <EpisodeMenu
        offset-x
        left
        :size="$constant.DEFAULT_BUTTON_SIZE_MOBILE"
        :episode="item"
        :publisher="publisher"
      />
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import EpisodeProgressBar from '~/components/parts/progress/EpisodeProgressBar.vue';
import EpisodeMenu from '~/components/containers/menu/EpisodeMenu.vue';
import { ON_ROW_CLICKED } from '~/components/parts/table/EpisodeTableRow.vue';
import type { App } from '~/entities';

export type On = {
  [ON_ROW_CLICKED]: App.EpisodeDetail;
};

export default defineComponent({
  components: {
    ExplicitChip,
    EpisodeProgressBar,
    EpisodeMenu,
  },

  props: {
    item: {
      type: Object as PropType<App.EpisodeDetail>,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    titleColor: {
      type: String as PropType<App.TitleColorClass | undefined>,
      default: undefined,
    },
    subtitleColor: {
      type: String as PropType<App.SubtitleColorClass>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const onRowClicked = () => { emit(ON_ROW_CLICKED, props.item); };
    return { onRowClicked };
  },
});
</script>

<style lang="scss" module>
.EpisodeTableRow {
  cursor: pointer;

  .Content {
    & > *:not(:last-child) {
      margin-bottom: 0.25rem;
    }

    &__title {
      display: flex;
      align-items: center;
      font-size: 0.9rem;

      & > *:first-child {
        @include avoid-overflowing();
      }

      & > *:not(:first-child) {
        margin-left: 0.5rem;
        flex: 0 0 $g-explicit-chip-width;
      }
    }
  }
}
</style>
