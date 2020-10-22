import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import ConfirmModal from './ConfirmModal.vue';

const CLICK = 'click';
const INPUT = 'input';
const ON_CONFIRMED = 'on-confirmed';

describe('ConfirmModal', () => {
  it('on cancel button clicked', async () => {
    const wrapper = mount(ConfirmModal, {
      ...options,
      propsData: {
        value: true,
      },
    });
    // 0番目は右上の閉じるボタン
    const cancelButton = wrapper.findAll('.v-btn').at(1);
    expect(cancelButton.vm.$slots.default?.[0].text).toMatch(/キャンセル/);
    await cancelButton.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0][0]).toBe(false);
  });

  it('on confirm clicked', async () => {
    const type = 'type';
    const wrapper = mount(ConfirmModal, {
      ...options,
      propsData: {
        value: true,
        type,
      },
    });
    const confirmButton = wrapper.findAll('.v-btn').at(2);
    expect(confirmButton.vm.$slots.default?.[0].text).toMatch(/確認/);
    await confirmButton.trigger(CLICK);
    expect(wrapper.emitted(ON_CONFIRMED)?.[0][0]).toBe(type);
  });
});
