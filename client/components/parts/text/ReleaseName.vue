<template>
  <div :class="[$style.ReleaseName, 'g-text-gradation']">
    <nuxt-link
      v-if="releasesPath != null"
      id="releaseNameLink"
      :to="releasesPath"
      :style="marqueeStyles"
      @mouseover.native="onHovered">
      {{ name }}
    </nuxt-link>
    <span
      v-else
      id="releaseNameLink"
      :style="marqueeStyles"
      @mouseover="onHovered">
      {{ name }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { sleep } from '~~/utils/sleep';

type Data = {
  isHoverd: boolean
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
      required: true,
      validator(value) {
        return typeof value === 'string' || value == null;
      },
    },
  },

  data(): Data {
    return {
      isHoverd: false,
      animationTimeoutId: null,
      parentWidth: null,
      linkWidth: null,
    };
  },

  computed: {
    releasesPath(): string | null {
      return this.releaseId != null
        ? `/releases/${this.releaseId}`
        : null;
    },
    marqueeSeconds(): number | null {
      if (!this.isHoverd || this.parentWidth == null || this.linkWidth == null) return null;
      if (this.linkWidth < this.parentWidth) return null;

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
      if (this.isHoverd) return;

      // ホバーしてから0.5秒後にアニメーションを開始
      const extraMillSeconds = 500;
      await sleep(extraMillSeconds);
      this.isHoverd = true;
      if (this.marqueeSeconds == null) {
        this.isHoverd = false;
        return;
      }

      // アニメーション終了後に再度アニメーションを受け付けられる状態にする
      this.animationTimeoutId = setTimeout(() => {
        this.isHoverd = false;
      }, this.marqueeSeconds * 1000 + extraMillSeconds);
    },
    clearTimeout() {
      if (this.animationTimeoutId != null) clearTimeout(this.animationTimeoutId);
      this.isHoverd = false;
    },
  },
});
</script>

<style lang="scss" module>
.ReleaseName {
  color: $g-title-color;
  font-size: 0.8rem;
  line-height: 1rem;
  padding: 8px;
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
