// @flow

import type { ActionArgs } from '../../core/action';

export default function createEvent(type: string, action: ActionArgs): CustomEvent {
  return new CustomEvent(type, { detail: { action } });
}
