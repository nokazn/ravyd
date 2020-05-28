<template>
  <div
    :title="name"
    :class="[$style.ReleaseName, 'g-text-gradation']"
  >
    <nuxt-link
      id="releaseNameLink"
      :to="releasePath"
      :style="marqueeStyles"
      @mouseover.native="onHovered"
    >
      {{ name }}
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { sleep } from '~~/utils/sleep';

type Data = {
  isHovered: boolean
  animationTimeoutId: ReturnType<typeof setTimeout> | null
  parentWidth: number | null
  linkWidth: number | null
};

export default Vue.extend({
  props: {
    name: {
      type: String,
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
      animationTimeoutId: null,
      parentWidth: null,
      linkWidth: null,
    };
  },

  computed: {
    releasePath(): string {
      return `/releases/${this.releaseId}`;
    },
    marqueeSeconds(): number | null {
      if (!this.isHovered || this.parentWidth == null || this.linkWidth == null) return null;
      if (this.linkWidth < this.parentWidth * 0.95) return null;

      const widthPerSeconds = 30;
      return Math.ceil((this.linkWidth / widthPerSeconds));
    },
    marqueeStyles(): { animation: string } | null {
      return this.marqueeSeconds != null
        ? { animation: `marquee ${this.marqueeSeconds}s linear 1` }
        : null;
    },
  },

  watch: {
    releaseId(): void {
      this.clearTimeout();
    },
  },

  methods: {
    calculateWidth() {
      const linkEle = document.getElementById('releaseNameLink');
      if (linkEle == null) {
        console.error('Not Found Element of which id is "releaseNameLink"');
        return;
      }

      this.linkWidth = linkEle?.clientWidth ?? null;
      const parentElement = linkEle?.parentElement;
      this.parentWidth = parentElement?.clientWidth ?? null;
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
      this.animationTimeoutId = null;
      this.isHovered = false;
    },
  },
});
</script>

<style lang="scss" module>
.ReleaseName {
  color: $g-title-color;
  font-size: 0.8rem;
  line-height: 1rem;
  padding: {
    right: 8px;
    left: 8px;
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
