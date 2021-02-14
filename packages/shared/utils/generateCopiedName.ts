export const generateCopiedName = (name: string): string => {
  // 最後が (2) のようになっているか
  const copiedName = /\(\d+\)$/.test(name)
    ? name.replace(/\((\d+)\)$/, (match, num: string) => {
      const version = parseInt(num, 10);
      // () 内の数字が 0 以上なら数字を +1 し、そうでなければそのまま (2) を付加する
      return version >= 0
        ? `(${version + 1})`
        : `${match} (2)`;
    })
    : `${name} (2)`;

  return copiedName;
};
