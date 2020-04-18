<template>
  <v-card
    hover
    ripple
    tile
    width="160"
    :class="$style.ReleaseCard">
    <div :class="$style.ReleaseCard__container">
      <v-hover #default="{ hover }">
        <v-img
          :src="src"
          :alt="alt"
          :height="height"
          :width="width"
          :aspect-ratio="1">
          <v-overlay
            v-if="hover"
            absolute
            :opacity="0.7">
            <v-hover #default="{ hover: buttonHoverd }">
              <v-icon
                :size="buttonSize(buttonHoverd)">
                mdi-play-circle
              </v-icon>
            </v-hover>
          </v-overlay>
        </v-img>
      </v-hover>

      <v-card-title :class="$style.ReleaseCard__title">
        {{ releaseName }}
      </v-card-title>

      <v-card-subtitle :class="$style.ReleaseCard__subtitle">
        {{ artistName }}
      </v-card-subtitle>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    releaseName: {
      type: String,
      required: true,
    },
    artistName: {
      type: String,
      required: true,
    },
    src: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      default: 160,
    },
    width: {
      type: Number,
      default: 160,
    },
  },

  computed: {
    alt() {
      return `${this.releaseName} - ${this.artistName}`;
    },
    buttonSize() {
      return (hover: boolean) => (hover
        ? 60
        : 48);
    },
  },
});
</script>

<style lang="scss" module>
.ReleaseCard {
  &__container {
    display: flex;
    flex-direction: column;
  }
  &__title {
    font-size: 0.78rem;
    padding: 12px 8px;
    line-height: 1rem;
  }
  &__subtitle {
    font-size: 0.7rem;
    padding: 8px;
    line-height: 1rem;
    margin-top: -8px!important;
  }
}
</style>
