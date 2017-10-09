import alfa from '../modules/alfa';
import Yallah from '../../src';

const yallah = new Yallah();
yallah.addModule([alfa]);
yallah.setInitialState({ alfa: { on: false } });
export default yallah;
