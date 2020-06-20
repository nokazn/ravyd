<template>
  <div :class="$style.TrackListWrapper">
    <div :class="$style.TrackListWrapper__header">
      <h2>
        {{ title }}
      </h2>

      <ShowAllButton
        :is-abbreviated="isAbbreviated"
        :abbreviated-length="abbreviatedLength"
        @on-clicked="onShowAllButtonClicked"
      />
    </div>

    <TrackList
      :track-list="trackList"
      :length="trackLength"
      :uri="uri"
      @on-favorite-button-clicked="onFavoriteButtonClicked"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ShowAllButton from '~/components/parts/button/ShowAllButton.vue';
import TrackList, { TrackDetail, On as OnList } from '~/components/containers/list/TrackList.vue';

export type Data = {
  isAbbreviated: boolean
}

const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = {
  [ON_FAVORITE_BUTTON_CLICKED]: OnList['on-favorite-button-clicked']
}

export default Vue.extend({
  components: {
    ShowAllButton,
    TrackList,
  },

  props: {
    abbreviatedLength: {
      type: Number,
      required: true,
    },
    trackList: {
      type: Array as PropType<TrackDetail[]>,
      required: true,
    },
    uri: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },

  data(): Data {
    return {
      isAbbreviated: true,
    };
  },

  computed: {
    trackLength(): number {
      return this.isAbbreviated
        ? this.abbreviatedLength
        : this.trackList.length;
    },
  },

  methods: {
    onShowAllButtonClicked() {
      this.isAbbreviated = !this.isAbbreviated;
    },
    onFavoriteButtonClicked({ ...row }: OnList['on-favorite-button-clicked']) {
      this.$emit(ON_FAVORITE_BUTTON_CLICKED, row);
    },
  },
});
</script>

<style lang="scss" module>
.TrackListWrapper {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
