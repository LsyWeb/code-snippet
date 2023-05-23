import { toRefs, reactive } from "vue";
import { toBoolean } from "./utils";
type AccessInit = () => Promise<Record<string, boolean | (() => boolean)>>;

let accessObject: any = null;

export async function setAccessState(fn: AccessInit) {
  const data = await fn();
  for (const key in data) {
    if (typeof data[key] === "function") {
      data[key] = toBoolean((data[key] as () => boolean)());
    } else {
      data[key] = toBoolean(data[key]);
    }
  }
  accessObject = data;
}

export default async function useAccess() {
  accessObject = reactive(accessObject);
  return accessObject;
}
