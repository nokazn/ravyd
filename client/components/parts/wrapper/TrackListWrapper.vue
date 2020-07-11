<template>
  <div :class="$style.TrackListWrapper">
    <div :class="$style.TrackListWrapper__header">
      <h2>
        {{ title }}
      </h2>

      <ShowAllTracksButton
        v-if="trackList.length > abbreviatedLength"
        :is-abbreviated="isAbbreviated"
        :abbreviated-length="abbreviatedLength"
        @on-clicked="onShowAllTracksButtonClicked"
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

import ShowAllTracksButton from '~/components/parts/button/ShowAllTracksButton.vue';
import TrackList, { On as OnList } from '~/components/containers/list/TrackList.vue';
import { App } from '~~/types';

export type Data = {
  isAbbreviated: boolean
}

const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = {
  [ON_FAVORITE_BUTTON_CLICKED]: OnList['on-favorite-button-clicked']
}

export default Vue.extend({
  components: {
    ShowAllTracksButton,
    TrackList,
  },

  props: {
    abbreviatedLength: {
      type: Number,
      required: true,
    },
    trackList: {
      type: Array as PropType<App.TrackDetail[]>,
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
    onShowAllTracksButtonClicked() {
      this.isAbbreviated = !this.isAbbreviated;
    },
    onFavoriteButtonClicked(row: OnList['on-favorite-button-clicked']) {
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
