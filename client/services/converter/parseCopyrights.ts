import { SpotifyAPI } from '~~/types';

type CopyrightMap = Record<string, ('C' | 'P')[]>

export const parseCopyrights = (copyrights: SpotifyAPI.Copyright[]): string[] => {
  const textNormalizedCopyrights = copyrights.map((copyright) => {
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
  const parsedCopyrightMap = textNormalizedCopyrights.reduce<CopyrightMap>((prev, copyright) => ({
    ...prev,
    [copyright.text]: prev[copyright.text] != null
      ? [...prev[copyright.text], copyright.type]
      : [copyright.type],
  }), {});

  const copyrightMapKeys = Object.keys(parsedCopyrightMap) as Array<
    keyof CopyrightMap
  >;

  return copyrightMapKeys.map((key) => {
    const types = parsedCopyrightMap[key]
      .map((type) => ({ C: '©', P: '℗' }[type]))
      .join('');
    return `${types} ${key}`;
  });
};
