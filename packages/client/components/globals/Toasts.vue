<template>
  <v-snackbars
    top
    :objects.sync="$toast.toasts"
    :class="$style.Toast"
  >
    <template #action="{ close }">
      <v-btn
        icon
        title="閉じる"
        @click="close()"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </template>
  </v-snackbars>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import VSnackbars from 'v-snackbars/v-snackbars.vue';

export default defineComponent({
  components: {
    VSnackbars,
  },
});
</script>

<style lang="scss" module>
.Toast {
  z-index: z-index-of(toast) !important;
}
</style>
