<template>
  <v-list
    rounded="lg"
    :elevation="12"
    :color="CARD_BACKGROUND_COLOR"
    :class="$style.TwoColumnsList"
  >
    <template
      v-for="(item, index) in itemList"
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
        v-show="itemList.length !== index + 1"
        :key="index"
      />
    </template>
  </v-list>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { CARD_BACKGROUND_COLOR } from '~/constants';

export type Item = {
  title: string
  value: string | null
}

type Data = {
  CARD_BACKGROUND_COLOR: string;
}

export default Vue.extend({
  props: {
    itemList: {
      type: Array as PropType<Item[]>,
      required: true,
    },
  },

  data(): Data {
    return {
      CARD_BACKGROUND_COLOR,
    };
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
