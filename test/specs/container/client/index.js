import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import sinonChai from 'sinon-chai';
import container from '../../../app/container/client';
import userState from '../../../data/state/user/index.json';
import { ClientContainer } from '../../../../src';
import Module from '../../../../src/core/module';

chai.use(dirtyChai);
chai.use(sinonChai);

describe('when the app container class is initialised', () => {
  it('should create an instance of the Yallah state tree', () => {
    expect(container).to.be.instanceOf(ClientContainer);
  });

  it('should add/have added its modules', () => {
    expect(container._modules.routing).to.be.instanceOf(Module);
    expect(container._modules.user).to.be.instanceOf(Module);
  });

  it('should stage the event listeners', () => {
    expect(container._eventListeners._listeners).to.be.lengthOf(10);
  });

  it('should stage the server state', () => {
    expect(container._serverState).to.eql({ user: userState });
  });
});

describe('when the app container is started', () => {
  beforeEach(async () => {
    await container.start();
  });

  afterEach(async () => {
    await container.stop();
    await container.reset();
  });

  it('should add the subscribers', () => {
    expect(Object.keys(container._subscribers)).to.be.lengthOf(7);
  });
});
