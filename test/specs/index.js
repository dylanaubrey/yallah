import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import sinonChai from 'sinon-chai';
import yallah from '../container';
import { turnOn } from '../actions/alfa';
import Yallah from '../../src';
import Module from '../../src/core/module';
import { createEvent } from '../../src/helpers';

chai.use(dirtyChai);
chai.use(sinonChai);

describe('when the app container class is initialised', () => {
  it('should create an instance of the Yallah state tree', () => {
    expect(yallah).to.be.instanceOf(Yallah);
  });

  it('should add/have added its modules', () => {
    expect(yallah._modules.routing).to.be.instanceOf(Module);
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

  it('should add the event listeners', () => {
    expect(yallah.getState('alfa')).to.eql({ on: false });
    const ev = createEvent('dispatch', turnOn({ on: true }));
    window.dispatchEvent(ev);
    expect(yallah.getState('alfa')).to.eql({ on: true });
  });

  // it('should add the subscribers', () => {
  //   // TODO
  // });

  // it('should set the default state', () => {
  //   // TODO
  // });
});
