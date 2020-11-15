import { onBeforeUnmount, SetupContext } from '@vue/composition-api';
import { ExtendedMutationPayload, RootMutations } from 'typed-vuex';

type MutationType = keyof RootMutations;

const typeMatcher = (
  origin: MutationType,
  target: MutationType | MutationType[],
): boolean => {
  return Array.isArray(target)
    ? target.some((t) => origin === t)
    : origin === target;
};

export const useMutationSubscriber = <T extends MutationType>(
  root: SetupContext['root'],
  type: T | T[],
  callback: (mutation: ExtendedMutationPayload<T>) => void | Promise<void>,
): (() => void) => {
  const mutationUnsubscribe = root.$subscribe<T>((mutation) => {
    if (typeMatcher(mutation.type, type)) {
      callback(mutation);
    }
  });

  onBeforeUnmount(() => {
    mutationUnsubscribe();
  });

  return mutationUnsubscribe;
};
