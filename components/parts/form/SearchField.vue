<template>
  <v-text-field
    v-model="text"
    hide-details
    dense
    :height="height"
    color="white"
    class="header__search-field">
    <template #prepend-inner>
      <v-icon :size="iconSize">
        mdi-magnify
      </v-icon>
    </template>

    <template #append>
      <transparent-icon-button
        icon="mdi-close"
        :size="iconSize"
        @click="clearText" />
    </template>
  </v-text-field>
</template>

<script lang="ts">
import Vue from 'vue';
import TransparentIconButton from '@/components/parts/button/TransparentIconButton.vue';

export default Vue.extend({
  components: {
    TransparentIconButton,
  },

  props: {
    value: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      default: 24,
    },
  },

  computed: {
    text: {
      get(): string {
        return this.value;
      },
      set(value: string) {
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
      console.log('onclick2');
    },
  },
});
</script>
