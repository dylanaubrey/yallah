// @flow

import { isArray, isFunction, isObjectLike } from 'lodash';
import type { ObjectMap } from '../../core/types';

const deepFreeze = async function deepFreeze(obj: ObjectMap): ObjectMap {
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
};

// NOTE: Default export of async function
// moved to a separate line due to bug in
// babel that is currently being fixed.
export default deepFreeze;
