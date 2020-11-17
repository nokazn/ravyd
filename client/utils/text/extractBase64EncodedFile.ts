export const extractBase64EncodedFile = (fileReader: FileReader) => {
  // readAsDataURL で読み取ったファイルの prefix を削除する
  return fileReader.result
    ?.toString()
    .replace(/^data:.+\/.+;base64,/, '');
};
