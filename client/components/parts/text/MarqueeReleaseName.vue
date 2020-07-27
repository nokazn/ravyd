<template>
  <div
    :title="name"
    :class="[$style.ReleaseName, 'g-text-gradation']"
  >
    <nuxt-link
      v-if="releasePath != null"
      :id="RELEASE_NAME_LINK"
      :to="releasePath"
      :style="marqueeStyles"
      @mouseover.native="onHovered"
    >
      {{ name }}
    </nuxt-link>
    <span
      v-else
      :id="RELEASE_NAME_LINK"
      :style="marqueeStyles"
      @mouseover="onHovered"
    >
      {{ name }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { sleep } from '~~/utils/sleep';
import { SpotifyAPI } from '~~/types';

const RELEASE_NAME_LINK = 'RELEASE_NAME_LINK';

type Data = {
  isHovered: boolean
  animationTimeoutId: ReturnType<typeof setTimeout> | undefined
  parentWidth: number | undefined
  linkWidth: number | undefined
  RELEASE_NAME_LINK: string
};

export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<SpotifyAPI.Player.PlayingType>,
      required: true,
    },
    releaseId: {
      type: String,
      required: true,
    },
  },

  data(): Data {
    return {
      isHovered: false,
      animationTimeoutId: undefined,
      parentWidth: undefined,
      linkWidth: undefined,
      RELEASE_NAME_LINK,
    };
  },

  computed: {
    releasePath(): string | undefined {
      switch (this.type) {
        case 'track':
          return `/releases/${this.releaseId}`;
        case 'episode':
          return `/shows/${this.releaseId}`;
        default:
          return undefined;
      }
    },
    marqueeSeconds(): number | undefined {
      if (!this.isHovered || this.parentWidth == null || this.linkWidth == null) return undefined;
      if (this.linkWidth < this.parentWidth * 0.95) return undefined;

      const widthPerSeconds = 30;
      return Math.ceil((this.linkWidth / widthPerSeconds));
    },
    marqueeStyles(): { animation: string } | undefined {
      return this.marqueeSeconds != null
        ? { animation: `marquee ${this.marqueeSeconds}s linear 1` }
        : undefined;
    },
  },

  watch: {
    releaseId(): void {
      this.clearTimeout();
    },
  },

  methods: {
    calculateWidth() {
      const linkEle = document.getElementById(RELEASE_NAME_LINK);
      if (linkEle == null) {
        console.error(`Not Found Element of which id is "${RELEASE_NAME_LINK}"`);
        return;
      }

      this.linkWidth = linkEle.clientWidth;
      const { parentElement } = linkEle;
      this.parentWidth = parentElement?.clientWidth;
    },
    async onHovered() {
      this.calculateWidth();
      // 既にアニメーションがスタートしてる場合はキャンセル
      if (this.isHovered) return;

      // ホバーしてから0.5秒後にアニメーションを開始
      const extraMillSeconds = 500;
      await sleep(extraMillSeconds);
      this.isHovered = true;
      if (this.marqueeSeconds == null) {
        this.isHovered = false;
        return;
      }

      // アニメーション終了後に再度アニメーションを受け付けられる状態にする
      this.animationTimeoutId = setTimeout(() => {
        this.isHovered = false;
      }, this.marqueeSeconds * 1000 + extraMillSeconds);
    },
    clearTimeout() {
      if (this.animationTimeoutId != null) clearTimeout(this.animationTimeoutId);
      this.animationTimeoutId = undefined;
      this.isHovered = false;
    },
  },
});
</script>

<style lang="scss" module>
.ReleaseName {
  color: $g-title-color;
  font-size: 0.9em;
  line-height: 1em;
  padding: {
    right: 0.5em;
    left: 0.5em;
  };

  white-space: nowrap;
  position: relative;

  & > * {
    display: inline-block;
  }
}
</style>

<style lang="scss">
@include marquee-animation;
</style>
