import { TURN_OFF, TURN_ON } from '../../actions/alfa';
import Module from '../../../src/core/module';

const alfa = new Module('alfa');

alfa.subscribe(TURN_ON, ({ payload }) => {
  alfa.setState(payload);
});

alfa.subscribe(TURN_OFF, ({ payload }) => {
  alfa.setState(payload);
});

export default alfa;
