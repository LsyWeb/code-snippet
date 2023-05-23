export const toBoolean = (value: any) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === 0 ||
    value === false ||
    value === "false"
  ) {
    return false;
  } else {
    return true;
  }
};