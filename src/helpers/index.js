import { isObjectLike } from 'lodash';

/**
 *
 * @param {Object} obj
 * @return {Object}
 */
export const deepFreeze = function deepFreeze(obj) {
  const propNames = Object.getOwnPropertyNames(obj);

  propNames.forEach((name) => {
    const propValue = obj[name];
    if (!isObjectLike(propValue)) return;
    deepFreeze(propValue);
    if (!isArray(propValue)) return;

    propValue.forEach((value) => {
      if (!isObjectLike(value)) return;
      deepFreeze(value);
    });
  });

  return Object.freeze(obj);
};
