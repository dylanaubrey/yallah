import { createReducer } from '../../helpers';

export default createReducer(async (previousState, { history }) => ({ ...previousState, history }));
