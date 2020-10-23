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
          <nuxt-link
            :to="episodePath"
            class="g-ellipsis-text"
            @click.native.stop
          >
            {{ item.name }}
          </nuxt-link>
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
        :resume-point="item.resumePoint"
        :duration-ms="item.durationMs"
        :max-width="56"
      />
    </td>

    <td>
      <EpisodeMenu
        offset-x
        left
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
import type { App } from '~~/types';

export type On = {
  [ON_ROW_CLICKED]: App.PlaylistTrackDetail;
}

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
    addedAt: {
      type: Boolean,
      default: true,
    },
    episodePath: {
      type: String,
      required: true,
    },
    titleColor: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    subtitleColor: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: String,
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

      & > *:not(:first-child) {
        margin-left: 0.25rem;
      }
    }
  }
}
</style>
