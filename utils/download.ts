/**
 * 根据图片地址获取base64
 * @param imgUrl 图片地址
 * @returns base64
 */
function getBase64(imgUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    window.URL = window.URL || window.webkitURL;
    // 声明一个XMLHttpRequest
    const xhr = new XMLHttpRequest();
    // 获取图片
    xhr.open('get', imgUrl, true);
    xhr.responseType = 'blob';
    xhr.send();
    xhr.onload = function () {
      if (this.status === 200) {
        // 得到一个blob对象
        const blob = this.response;
        const oFileReader = new FileReader();
        oFileReader.onloadend = function (e) {
          const base64 = e.target?.result;
          //拿到base64 传出结果
          resolve(base64 as string);
        };
        oFileReader.onerror = function (e) {
          reject();
        };
        oFileReader.readAsDataURL(blob);
      }
    };
  });
}


/**
 * 根据图片的Base64数据下载图片
 * @param base64Data base64数据
 * @param filename 下载时的文件名
 */
function downloadImageFromBase64(base64Data: string, filename: string): void {
  const base64String = base64Data.replace(
    /^data:image\/(png|jpg|jpeg);base64,/,
    "",
  );
  // 创建一个 Blob 对象
  const byteCharacters = window.atob(base64String);

  const byteArrays: Uint8Array[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: "image/png" });

  // 创建一个临时链接并触发下载
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  // 清理链接和 Blob 对象
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}



/**
 * 根据图片的url下载图片
 * @param url 图片的url
 * @param filename 下载时的文件名
 */
function downloadImageFromUrl(url: string, filename: string) {
  getBase64(url).then((base64Data: string) => {
    downloadImageFromBase64(base64Data, filename);
  });
}
