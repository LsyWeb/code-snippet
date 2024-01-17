// export type CompressImageOptions = {
//   /**
//    * 最大宽度
//    */
//   maxWidth?: number;
//   /**
//    * 最大高度
//    */
//   maxHeight?: number;
//   /**
//    * 图片质量，仅有 image/jpeg 和 image/webp 类型时才有效
//    */
//   quality?: number;
//   /**
//    * 图片类型, 默认为 image/jpeg，可选值为 image/png，image/webp；如果是 image/png，则quality参数无效，只能通过宽高来进行压缩
//    */
//   imageType?: 'image/jpeg' | 'image/png' | 'image/webp';
// };

/**
 *
 * @param {File} file
 * @param {CompressImageOptions} options
 * @returns {Promise<Blob | null>}
 */
function compressImage(file, options) {
  const {
    maxWidth = 1080,
    maxHeight = 1080,
    quality = 0.92,
    imageType = "image/jpeg",
  } = options || {};
  return new Promise((resolve, reject) => {
    if (!file) {
      console.error("未选择文件");
      reject("未选择文件");
      return;
    }

    const image = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target && e.target.result) {
        image.src = e.target.result;

        image.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            console.error("无法获取 Canvas 上下文");
            reject("无法获取 Canvas 上下文");
            return;
          }

          // 计算调整后的宽度和高度，保持纵横比
          let newWidth = image.width;
          let newHeight = image.height;

          // 只有当图片的宽度和高度都大于最大值时才需要进行分辨率的调整
          if (newWidth > maxWidth && newHeight > maxHeight) {
            if (newWidth < newHeight) {
              newWidth = maxWidth;
              newHeight = (image.height * maxWidth) / image.width;
            } else {
              newHeight = maxHeight;
              newWidth = (image.width * maxHeight) / image.height;
            }
          }

          // 设置 Canvas 大小并绘制图片
          canvas.width = newWidth;
          canvas.height = newHeight;
          ctx.drawImage(image, 0, 0, newWidth, newHeight);

          // 将 Canvas 上的图像转换为 Blob
          canvas.toBlob(
            async (blob) => {
              if (!blob) {
                console.error("无法生成 Blob 对象");
                reject("无法生成 Blob 对象");
                return;
              }

              // 返回压缩后的 Blob
              resolve(blob);
            },
            imageType,
            quality,
          ); // quality 是 JPEG 压缩质量，可以根据需要调整
        };
      }
    };

    reader.readAsDataURL(file);
  });
}

export default compressImage;
