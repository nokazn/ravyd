<template>
  <v-card class="two-columns-list-card">
    <v-list>
      <template
        v-for="(item, index) in itemList"
      >
        <v-list-item
          :key="item.title"
        >
          <v-list-item-content>
            <v-list-item-title class="two-columns-list-card__content">
              <div>
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

<style lang="scss" scoped>
.two-columns-list-card {
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
