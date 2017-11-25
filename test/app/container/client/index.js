// @flow

import { click } from '../../actions/user';
import userModule from '../../modules/user';
import userState from '../../../data/state/user/index.json';
import { ClientContainer } from '../../../../src';

const container = new ClientContainer();
// container.addConfig([]);
container.addModule([userModule]);

container.listen({
  callback: function onClick(e: Event): void {
    container.dispatch(click(e));
  },
  target: document,
  type: 'click',
});

container.addServerState({ user: userState });
export default container;
