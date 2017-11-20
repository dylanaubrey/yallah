import { cloneDeep, isArray, isFunction, isObjectLike } from 'lodash';

/**
 *
 * @param {Object} obj
 * @return {Object}
 */
export async function deepFreeze(obj) {
  const propNames = Object.getOwnPropertyNames(obj);

  await Promise.all(propNames.map(async (name) => {
    const propValue = obj[name];

    if (isFunction(propValue)) {
      delete obj[name];
      return;
    }

    if (!isObjectLike(propValue)) return;
    await deepFreeze(propValue);
    if (!isArray(propValue)) return;

    obj[name] = await Promise.all(propValue.reduce(value => !isFunction(value))
      .map(async (value) => {
        if (!isObjectLike(value)) return value;
        return deepFreeze(value);
      }));
  }));

  return Object.freeze(obj);
}

/**
 *
 * @param {Function} callback
 * @return {void}
 */
export function createReducer(callback) {
  return async (previousState, newState) => deepFreeze(await callback(
    previousState,
    cloneDeep(newState),
  ));
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
