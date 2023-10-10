function compressImage(file, maxWidth, maxHeight, maxSizeInMB, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file) {
      console.error("未选择文件");
      reject("未选择文件");
      return;
    }

    if (file.size <= maxSizeInMB * 1024 * 1024) {
      resolve(file);
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

          // 只有当图片的宽度和高度都大于最大值时才需要进行调整
          if (newWidth > maxWidth && newHeight > maxHeight) {
            if (newWidth < newHeight) {
              newWidth = maxWidth;
              newHeight = (image.height * maxWidth) / image.width;
            } else {
              newHeight = maxHeight;
              newWidth = (image.width * maxHeight) / image.height;
            }
          } else {
            resolve(file);
            return;
          }
          console.log(newWidth, newHeight);

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

              // 检查 Blob 大小是否小于指定的大小限制
              if (blob.size > maxSizeInMB * 1024 * 1024) {
                console.error("压缩后图片大小仍然超过目标大小");
                resolve(null);
                return;
              }

              // 返回压缩后的 Blob
              resolve(blob);
            },
            "image/jpeg",
            quality,
          ); // quality 是 JPEG 压缩质量，可以根据需要调整
        };
      }
    };

    reader.readAsDataURL(file);
  });
}

// // 示例使用方法
// const fileInput = document.getElementById("fileInput");
// const maxWidth = 1080;
// const maxHeight = 1080;
// const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

// processImage(file, maxWidth, maxHeight, maxSizeInBytes).then(
//   (compressedBlob) => {
//     if (compressedBlob) {
//       // 在这里可以将压缩后的 Blob 上传到服务器或进行其他操作
//       console.log("压缩后的 Blob:", compressedBlob);
//     }
//   },
// );

export default compressImage;
