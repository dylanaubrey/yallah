// @flow

import { isArray, isFunction, isObjectLike } from 'lodash';
import type { ObjectMap } from '../../core/types';

export default async function deepFreeze(obj: ObjectMap): ObjectMap {
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
