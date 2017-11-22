import { click } from '../actions/user';
import userModule from '../modules/user';
import userState from '../state/user/index.json';
import { ClientContainer } from '../../src';

const container = new ClientContainer();
// container.addConfig([]);
container.addModule([userModule]);

container.listen({
  callback: (e) => {
    container.dispatch(click(e));
  },
  target: document,
  type: 'click',
});

container.addServerState({ user: userState });
export default container;
