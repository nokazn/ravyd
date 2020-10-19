import { SetupContext } from '@vue/composition-api';

export const useCopyText = (root: SetupContext['root'], text: string, name: string): void => {
  const copyEventListener = (e: ClipboardEvent) => {
    if (e.clipboardData == null) {
      root.$toast.push({
        color: 'error',
        message: `${name}をコピーできませんでした。`,
      });
      return;
    }

    e.preventDefault();
    e.clipboardData.setData('text/plain', text);
    document.removeEventListener('copy', copyEventListener);

    root.$toast.push({
      color: 'primary',
      message: `${name}をコピーしました。`,
    });
  };

  document.addEventListener('copy', copyEventListener);
  document.execCommand('copy');
};
