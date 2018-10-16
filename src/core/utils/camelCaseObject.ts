import { camelCase } from 'lodash';
import { isArray, isObject } from 'util';

const camelCaseObject = (obj: any): any => {
  if (isArray(obj)) {
    return obj.map(value => {
      if (isObject(value)) {
        value = camelCaseObject(value);
      }

      return value;
    });
  }

  return Object.keys(obj).reduce((acc, key) => {
    let value = obj[key];

    if (isObject(value)) {
      value = camelCaseObject(value);
    }

    acc[camelCase(key)] = value;
    return acc;
  }, {});
};

export default camelCaseObject;
