import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import sinonChai from 'sinon-chai';
import yallah from '../state-tree';
import Yallah from '../../src';

chai.use(dirtyChai);
chai.use(sinonChai);

describe('when the Yallah class is initialised', () => {
  it('should create an instance of the Yallah state tree', () => {
    expect(yallah).to.be.instanceOf(Yallah);
  });
});
