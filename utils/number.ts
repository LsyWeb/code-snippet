/**
 * 保留小数位数
 * @param num 要格式化的数字
 * @param precision 精度 0-20
 * @param useGrouping 是否使用分组分隔符，如 1,000,000
 * @returns 
 */
function numToFixed(num: number, precision: number = 2, useGrouping: boolean = false) {
  return new Intl.NumberFormat("en-US", {
    useGrouping,
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(num);
}

