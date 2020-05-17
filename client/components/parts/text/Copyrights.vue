<template>
  <div :class="$style.Copyrights">
    <small
      v-for="copyright in parsedCopyrightList"
      :key="copyright"
      :class="$style.Copyrights__item">
      {{ copyright }}
    </small>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { SpotifyAPI } from '~~/types';

export type ParsedCopyrightMap = {
  [k: string]: Array<'C' | 'P'>;
}

export default Vue.extend({
  props: {
    copyrightList: {
      type: Array as PropType<SpotifyAPI.Copyright[]>,
      required: true,
    },
  },

  computed: {
    parsedCopyrightList(): string[] {
      const parsedCopyrightList = this.copyrightList.map((copyright) => {
        // 文頭の C/P マーク
        const typeReg = copyright.type === 'C'
          ? /^(Ⓒ|🄫|©|ⓒ|⒞|\(C\))\s?/
          : /^(Ⓟ|ⓟ|℗|⒫|\(P\))\s?/;
        return {
          type: copyright.type,
          text: copyright.text.replace(typeReg, ''),
        };
      });

      // 同じ Copyright の文面はまとめる
      const parsedCopyrightMap = parsedCopyrightList.reduce((prev, copyright) => ({
        ...prev,
        [copyright.text]: prev[copyright.text] != null
          ? [...prev[copyright.text], copyright.type]
          : [copyright.type],
      }), {} as ParsedCopyrightMap);

      const parsedCopyrightMapKeyList = Object.keys(parsedCopyrightMap) as Array<
        keyof ParsedCopyrightMap
      >;

      return parsedCopyrightMapKeyList.map((key) => {
        const types = parsedCopyrightMap[key]
          .map((type) => ({ C: '©', P: '℗' }[type]))
          .join('');
        return `${types} ${key}`;
      });
    },
  },
});
</script>

<style lang="scss" module>
.Copyrights {
  &__item {
    color: $g-subtitle-color;
    display: block;
    font-size: 0.7em;
    &:not(:last-child) {
      margin-bottom: 2px;
    }
  }
}
</style>
