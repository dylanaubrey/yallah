import Yallah from '../../src';
import routing from './branches/routing';

const yallah = new Yallah();

yallah.addBranch([
  routing,
]);

export default yallah;
