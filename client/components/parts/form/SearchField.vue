<template>
  <div>
    <v-text-field
      v-model="text"
      dense
      hide-details
      rounded
      light
      background-color="grey lighten-4"
      :height="height"
      title="検索"
      :class="$style.SearchField">
      <template #prepend-inner>
        <v-icon
          :size="iconSize"
          color="grey darken-4"
          title="検索"
          :class="$style.SearchField__prependInnerIcon">
          mdi-magnify
        </v-icon>
      </template>

      <template #append>
        <v-icon
          v-show="value !== ''"
          :size="iconSize"
          color="grey darken-1"
          :class="$style.SearchField__clearIcon"
          title="消去"
          @click="clearText">
          mdi-close
        </v-icon>
      </template>
    </v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    value: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      default: 28,
    },
  },

  computed: {
    text: {
      get(): string {
        return this.value;
      },
      set(value: string): void {
        this.$emit('input', value);
      },
    },
    iconSize(): number {
      return (this.height * 2) / 3;
    },
  },

  methods: {
    clearText() {
      this.text = '';
    },
  },
});
</script>

<style lang="scss" module>
.SearchField {
  min-width: 140px;
  max-width: 180px;
  position: relative;
  &__prependInnerIcon {
    margin-left: -16px;
    position: absolute;
    top: 0;
    left: 0;
  }
  &__clearIcon {
    cursor: pointer;
    margin-right: -16px;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
