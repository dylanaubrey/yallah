import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import sinonChai from 'sinon-chai';
import yallah from '../../container';
import userState from '../../state/user/index.json';
import Yallah from '../../../src';
import Module from '../../../src/core/module';

chai.use(dirtyChai);
chai.use(sinonChai);

describe('when the app container class is initialised', () => {
  it('should create an instance of the Yallah state tree', () => {
    expect(yallah).to.be.instanceOf(Yallah);
  });

  it('should add/have added its modules', () => {
    expect(yallah._modules.routing).to.be.instanceOf(Module);
    expect(yallah._modules.user).to.be.instanceOf(Module);
  });

  it('should stage the event listeners', () => {
    expect(yallah._listeners).to.be.lengthOf(1);
  });

  it('should stage the initial state', () => {
    expect(yallah._initialState).to.eql({ user: userState });
  });
});

describe('when the app container is started', () => {
  beforeEach(async () => {
    await yallah.start();
  });

  afterEach(async () => {
    await yallah.stop();
    await yallah.reset();
  });

  it('should add the subscribers', () => {
    expect(Object.keys(yallah._subscribers)).to.be.lengthOf(7);
  });
});
