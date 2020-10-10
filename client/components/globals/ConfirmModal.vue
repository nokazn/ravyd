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
import Vue from 'vue';
import ConfirmModal from '~/components/parts/modal/ConfirmModal.vue';

export default Vue.extend({
  components: {
    ConfirmModal,
  },
});
</script>
