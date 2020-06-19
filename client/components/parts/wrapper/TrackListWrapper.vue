<template>
  <div :class="$style.TrackListWrapper">
    <div :class="$style.TrackListWrapper__header">
      <h2>
        {{ title }}
      </h2>

      <show-all-button
        :is-omitted="isOmmited"
        :omitted-length="omittedLength"
        @on-clicked="onShowAllButtonClicked"
      />
    </div>

    <track-list
      :track-list="trackList"
      :length="length"
      :uri="uri"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ShowAllButton from '~/components/parts/button/ShowAllButton.vue';
import TrackList, { TrackDetail } from '~/components/containers/list/TrackList.vue';

export { TrackDetail } from '~/components/containers/list/TrackList.vue';

export type Data = {
  isOmmited: boolean
}

export default Vue.extend({
  components: {
    ShowAllButton,
    TrackList,
  },

  props: {
    title: {
      type: String,
      required: true,
    },
    omittedLength: {
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
  },

  data(): Data {
    return {
      isOmmited: true,
    };
  },

  computed: {
    length(): number {
      return this.isOmmited
        ? this.omittedLength
        : this.trackList.length;
    },
  },

  methods: {
    onShowAllButtonClicked() {
      this.isOmmited = !this.isOmmited;
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
