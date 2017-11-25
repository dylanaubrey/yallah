// @flow

import type { ActionArgs } from '../../../../src/core/action';

export const CLICK = 'USER/CLICK';

export function click(e: Event): ActionArgs {
  return { type: CLICK, payload: e };
}
