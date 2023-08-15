function mergeCells<T>(arr: T[], key: keyof T) {
  const mergedArray: T[] = [];
  const visitedCells: any = {};

  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    const value = obj[key];

    if (!visitedCells[value]) {
      let rowSpan = 1;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j][key] === value) {
          rowSpan++;
          visitedCells[arr[j][key]] = true;
        } else {
          break;
        }
      }
      mergedArray.push({ ...obj, rowSpan });
      visitedCells[value] = true;
    } else {
      mergedArray.push({ ...obj, rowSpan: 0 });
    }
  }

  return mergedArray;
}

