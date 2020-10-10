<template>
  <v-card rounded="lg">
    <v-list
      :elevation="12"
      :color="$constant.CARD_BACKGROUND_COLOR"
      :class="$style.TwoColumnsList"
    >
      <template
        v-for="(item, index) in items"
      >
        <v-list-item
          :key="item.title"
          :class="$style.TwoColumnsList__item"
        >
          <v-list-item-content>
            <v-list-item-title :class="$style.TwoColumnsList__content">
              <div class="subtext--text">
                {{ item.title }}
              </div>

              <div>
                {{ item.value }}
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider
          v-show="items.length !== index + 1"
          :key="index"
        />
      </template>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export type Item = {
  title: string;
  value: string | null;
}

export default Vue.extend({
  props: {
    items: {
      type: Array as PropType<Item[]>,
      required: true,
    },
  },
});
</script>

<style lang="scss" module>
.TwoColumnsList {
  &__item {
    margin-bottom: 0 !important;
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr;

    & > *:first-child {
      font-size: 0.9em;
    }
  }
}
</style>
