import { SetupContext } from '@vue/composition-api';

export const useCopyText = (root: SetupContext['root'], text: string, name: string): void => {
  const copyEventListener = (e: ClipboardEvent) => {
    if (e.clipboardData == null) {
      root.$toast.pushError(`${name}をコピーできませんでした。`);
      return;
    }
    e.preventDefault();
    e.clipboardData.setData('text/plain', text);
    document.removeEventListener('copy', copyEventListener);

    root.$toast.pushPrimary(`${name}をコピーしました。`);
  };

  document.addEventListener('copy', copyEventListener);
  document.execCommand('copy');
};
