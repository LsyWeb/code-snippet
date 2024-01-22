import type OSS from 'ali-oss';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import dayjs from 'dayjs';
import type { CompressImageOptions } from '../../../compressImage/compressImage';
import compressImage from '../../../compressImage/compressImage';

const UPLOAD_PATH = () => {
  return `${dayjs().format('YYYY')}/${dayjs().format('MM')}/${dayjs().format(
    'DD',
  )}`;
};

export type OssUploadFieldPropsOptions = {
  /**
   * 上传路径 xxxx/xxx/xxx
   */
  uploadPath?: string;
  /**
   * 是否校验文件为图片
   */
  validImage?: ((file: File) => boolean) | boolean;
  /**
   * 是否压缩
   */
  isCompress?: boolean;
  /**
   * 压缩配置
   */
  compressOptions?: CompressImageOptions;
};

/**
 * 阿里云上传配置
 * @returns {UploadProps}
 */
export const OssUploadFieldProps = (
  ossClient: OSS | undefined,
  ossUploadProps: UploadProps,
  options?: OssUploadFieldPropsOptions,
): UploadProps => {
  const { isCompress = true, uploadPath, validImage = false } = options || {};
  const { maxWidth = 1080, maxHeight = 1080 } = options?.compressOptions || {};
  return {
    customRequest: async (e: any) => {
      let file = e.file;
      const suffix = file.name.slice(file.name.lastIndexOf('.'));
      const newFileName = `${dayjs().format('HHmmss')}-${Math.random()
        .toString(36)
        .substring(2)}${suffix}`;

      if (isCompress) {
        const blob = await compressImage(file, {
          maxHeight,
          maxWidth,
        });
        if (blob) {
          file = new File([blob], newFileName, { type: blob.type });
        }
      }

      const result = await ossClient
        ?.put(`${uploadPath ? uploadPath : UPLOAD_PATH()}/${newFileName}`, file)
        .catch(e.onError);
      if (result) {
        e.onSuccess(result.url);
      } else {
        e.onError('上传失败');
      }
    },
    beforeUpload(file: File) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      const isValidImage = typeof validImage === 'function' ? validImage(file) : validImage;

      if (!isJpgOrPng && isValidImage) {
        message.error('只允许上传 JPG/PNG 类型的文件!');
        return Upload.LIST_IGNORE;
      }
      return isJpgOrPng;
    },
    ...ossUploadProps,
  } as UploadProps;
};
