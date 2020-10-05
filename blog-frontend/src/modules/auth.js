import { createAction, handleActins } from 'react-actions';

const SAMPLE_ACTION = 'auth/SAMPLE_ACTION';

export const sampleAction = createAction(SAMPLE_ACTION);

const initalState = {};

const auth = handleActins(
  {
    [SAMPLE_ACTION]: (state, action) => state,
  },
  initalState,
);

export default auth;
