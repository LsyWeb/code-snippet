const charsAllCode: string[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
];

const charsLetterCode: string[] = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

/**
 * 获取随机字符串，根据传入的字符数组
 * @param length 字符串长度
 * @param chars
 * @returns {string}
 */
const getRandomString = (length: number, chars: string[]): string => {
  return Array.from({ length }, () => {
    const randomIndex = Math.floor(Math.random() * chars.length);
    return chars[randomIndex];
  }).join("");
};

/**
 * 获取随机字符串，只包含字母
 * @param length 字符串长度
 * @returns {string}
 */
const getRandomLetterString = (length: number): string => {
  return getRandomString(length, charsLetterCode);
};

/**
 * 获取随机字符串，包含大小写字母和特殊字符
 * @param length 字符串长度
 * @returns {string}
 */
const getRandomAllCodeString = (length: number): string => {
  return getRandomString(length, charsLetterCode);
};

/**
 * 生成随机HEX颜色（16进制颜色）
 * @returns { String } 随机HEX颜色字符串
 */
const randomColor = (): string => {
  return (
    "#" +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padEnd(6, "0")
  );
};

/**
 * 生成一个介于两者之间的随机数
 * @param { Number } max 最大值
 * @param { Number } min 最小值
 * @returns { Number }
 */
const random = (max: number, min: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};