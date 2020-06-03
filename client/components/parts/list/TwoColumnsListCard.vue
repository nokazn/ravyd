<template>
  <v-card :class="$style.TwoColumnsListCard">
    <v-list>
      <template
        v-for="(item, index) in itemList"
      >
        <v-list-item
          :key="item.title"
        >
          <v-list-item-content>
            <v-list-item-title :class="$style.TwoColumnsListCard__content">
              <div v-text="item.title" />
              <div v-text="item.value" />
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider
          v-show="itemList.length !== index + 1"
          :key="index"
        />
      </template>
    </v-list>
    <v-card />
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export type ItemList = {
  title: string
  value: string | null
}[]

export default Vue.extend({
  props: {
    itemList: {
      type: Array as PropType<ItemList>,
      required: true,
    },
  },
});
</script>

<style lang="scss" module>
.TwoColumnsListCard {
  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    & > *:first-child {
      color: #bdbdbd;
      font-size: 0.9em;
    }
  }
}
</style>
