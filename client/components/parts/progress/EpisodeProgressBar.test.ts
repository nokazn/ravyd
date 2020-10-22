import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import EpisodeProgressBar from './EpisodeProgressBar.vue';

describe('EpisodeProgressBar', () => {
  it('in progress', async () => {
    const wrapper = mount(EpisodeProgressBar, {
      ...options,
      propsData: {
        resumePoint: {
          fully_played: false,
          resume_position_ms: 60000,
        },
        durationMs: 120000,
        text: true,
      },
    });
    expect(wrapper.find('.EpisodeProgressBar__text').text()).toBe('残り1分0秒');
    const progress = wrapper.find('.EpisodeProgressBar__progress');
    expect(progress.attributes().title).toBe('1:00まで再生');
    expect(progress.props().value).toBe(50);
  });

  it('unplayed', async () => {
    const wrapper = mount(EpisodeProgressBar, {
      ...options,
      propsData: {
        resumePoint: {
          fully_played: false,
          resume_position_ms: 0,
        },
        durationMs: 120000,
        text: true,
      },
    });
    expect(wrapper.find('.EpisodeProgressBar__text').text()).toBe('未再生');
    const progress = wrapper.find('.EpisodeProgressBar__progress');
    expect(progress.attributes().title).toBe('未再生');
    expect(progress.props().value).toBe(0);
  });

  it('fully played', async () => {
    const wrapper = mount(EpisodeProgressBar, {
      ...options,
      propsData: {
        resumePoint: {
          fully_played: true,
          resume_position_ms: 120000,
        },
        durationMs: 120000,
        text: true,
      },
    });
    expect(wrapper.find('.EpisodeProgressBar__text').text()).toBe('再生済み');
    const progress = wrapper.find('.EpisodeProgressBar__progress');
    expect(progress.attributes().title).toBe('再生済み');
    expect(progress.props().value).toBe(100);
  });
});
