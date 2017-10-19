import { isArray, isObjectLike } from 'lodash';

/**
 *
 * @param {Object} obj
 * @return {Object}
 */
export async function deepFreeze(obj) {
  const propNames = Object.getOwnPropertyNames(obj);

  await Promise.all(
    propNames.map(async (name) => {
      const propValue = obj[name];
      if (!isObjectLike(propValue)) return;
      await deepFreeze(propValue);
      if (!isArray(propValue)) return;

      await Promise.all(
        propValue.map(async (value) => {
          if (!isObjectLike(value)) return;
          await deepFreeze(value);
        }),
      );
    }),
  );

  return Object.freeze(obj);
}

/**
 *
 * @param {Function} callback
 * @return {void}
 */
export function createReducer(callback) {
  return async (previousState, newState) => {
    await callback(previousState, await deepFreeze(newState));
  };
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
