import createReducer from '../../helpers/create-reducer';

export default createReducer(async (previousState, { history }) => ({ ...previousState, history }));
