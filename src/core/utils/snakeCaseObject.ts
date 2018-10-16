import { snakeCase } from 'lodash';
import { isArray, isObject } from 'util';

const snakeCaseObject = (obj: any): any => {
  if (isArray(obj)) {
    return obj.map(value => {
      if (isObject(value)) {
        value = snakeCaseObject(value);
      }

      return value;
    });
  }

  return Object.keys(obj).reduce((acc, key) => {
    let value = obj[key];

    if (isObject(value)) {
      value = snakeCaseObject(value);
    }

    acc[snakeCase(key)] = value;
    return acc;
  }, {});
};

export default snakeCaseObject;
