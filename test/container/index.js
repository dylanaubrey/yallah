import { click } from '../actions/user';
import userModule from '../modules/user';
import userState from '../state/user/index.json';
import Yallah from '../../src';

const yallah = new Yallah();
yallah.addModule([userModule]);

yallah.listen(document, 'click', async (e) => {
  yallah.dispatch(click(e));
});

yallah.setInitialState({ user: userState });
export default yallah;
