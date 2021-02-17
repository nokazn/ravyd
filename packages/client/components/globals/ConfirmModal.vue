<template>
  <ConfirmModal
    v-model="$confirm.value"
    :color="$confirm.color"
    :title="$confirm.title"
    :text="$confirm.text"
    :loading="$confirm.loading"
    @on-confirmed="$confirm.onConfirm"
  >
    {{ $confirm.description }}
  </ConfirmModal>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import ConfirmModal from '~/components/parts/modal/ConfirmModal.vue';

export default defineComponent({
  components: {
    ConfirmModal,
  },
});
</script>
