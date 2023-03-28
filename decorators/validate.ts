interface Options {
  message: string;
}
function IsString(options: Options) {
  return function (target: any, propName: string) {
    if (!target.$propValitate) {
      target.$propValitate = [];
    }
    target.$propValitate.push({
      propName,
      type: "IsString",
      options,
    });
  };
}

function maxLength(num: number, options: Options) {
  return function (target: any, propName: string) {
    if (!target.$propValitate) {
      target.$propValitate = [];
    }
    target.$propValitate.push({
      propName,
      type: "maxLength",
      options: { ...options, num },
    });
  };
}

function validate(obj: any) {
  const object = Object.getPrototypeOf(obj);
  object.$propValitate?.forEach(({ propName, type, options }) => {
    if (type === "maxLength") {
      if (obj[propName].length > options.num) {
        throw new Error(`${propName} ${options.message}`);
      }
    } else if (type === "IsString") {
      if (obj[propName] && typeof obj[propName] !== "string") {
        throw new Error(`${propName} ${options.message}`);
      }
    }
  });
}

class User {
  @maxLength(10, { message: "最大长度为10" })
  @IsString({ message: "必须是字符串" })
  loginId: string;
}

const u1 = new User();
u1.loginId = "213dsfsfdsfdfdsfsfds";

validate(u1);
