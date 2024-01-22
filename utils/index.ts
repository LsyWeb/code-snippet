/**
 * 延迟函数
 * @param duration 延迟时间，单位毫秒
 * @returns {Promise<void>}
 */
const delay = (duration: number = 1000): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
};

/**
 * 获取类名
 * @param obj 类名对象
 * @returns {string} 类名字符串
 */
const getClassName = (obj: Record<string, boolean>): string => {
  let className = '';
  for (const key in obj) {
    if (obj[key]) {
      className += ` ${key}`;
    }
  }
  return className;
};