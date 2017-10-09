import { isArray, isObjectLike } from 'lodash';

/**
 *
 * @param {Object} obj
 * @return {Object}
 */
export function deepFreeze(obj) {
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
}

/**
 *
 * @param {string} type
 * @param {Object} action
 * @return {CustomEvent}
 */
export function createEvent(type, action) {
  return new CustomEvent(type, { detail: { action } });
}
