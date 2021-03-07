import pino, { LevelWithSilent } from 'pino';

const isPrimitive = (t: unknown) => {
  return typeof t === 'string' || typeof t === 'number' || typeof t === 'boolean';
};
const joinRest = (list1: any[], list2?: any[]): string => {
  return [...list1, ...(list2 ?? [])].join(', ');
};

const level: LevelWithSilent = process.env.NODE_ENV === 'production'
  ? 'info'
  : 'trace';

export const logger = pino({
  level,
  hooks: {
    // 両端のいずれかが Object のときのみ展開し、残りを連結
    logMethod(args, method) {
      const l = args.length;
      if (l > 1) {
        const restExceptEdge = args.slice(1, l - 1);
        if (restExceptEdge.every(isPrimitive)) {
          const first = args[0];
          const last = args[l - 1];
          if (isPrimitive(first)) {
            if (isPrimitive(last)) return method.apply(this, [joinRest(args)]);
            return method.apply(this, [last, joinRest([first], restExceptEdge)]);
          }
          if (isPrimitive(last)) {
            return method.apply(this, [first, joinRest(restExceptEdge, [last])]);
          }
        }
      }
      return method.apply(this, args as any);
    },
  },
  browser: {
    asObject: true,
  },
  prettyPrint: {
    colorize: true,
  },
});

