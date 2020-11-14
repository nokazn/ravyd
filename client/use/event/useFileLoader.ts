export const useFileLoader = (
  onLoad: (e: ProgressEvent<FileReader>, f: FileReader) => void | Promise<void>,
  onError: (e: ProgressEvent<FileReader>, f: FileReader) => void | Promise<void>,
): FileReader => {
  const fileReader = new FileReader();

  const loadCallback = (e: ProgressEvent<FileReader>) => {
    onLoad(e, fileReader);
    fileReader.removeEventListener('load', loadCallback);
  };
  fileReader.addEventListener('load', loadCallback);

  const errorCallback = (e: ProgressEvent<FileReader>) => {
    onError(e, fileReader);
    console.error(fileReader.error);
    fileReader.removeEventListener('error', errorCallback);
  };
  fileReader.addEventListener('error', errorCallback);

  return fileReader;
};
