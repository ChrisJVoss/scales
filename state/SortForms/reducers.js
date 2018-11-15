import {
  GETTING_SORT_FORMS,
  GOT_SORT_FORMS,
  UPLOAD_SUCCESSFUL,
  MERGING_BUCKET,
  UPLOADING_MERGE,
  CREATED_PAILS,
  MERGING_BOX_TO_PAIL,
  CREATED_DRUM,
  SWAPPED_BUCKET,
  GOT_PAILS,
  DATE_SET
} from './types';
const INITIAL_STATE = {
  forms: [],
  fetching: false,
  pails: {},
  drumId: 'abc',
  date: '2016-10-10'
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETTING_SORT_FORMS:
      return Object.assign({}, state, { fetching: true });
    case GOT_SORT_FORMS:
      return Object.assign({}, state, {
        forms: action.payload,
        fetching: false
      });
    case UPLOAD_SUCCESSFUL:
      return Object.assign({}, state);
    case MERGING_BUCKET:
      return Object.assign({}, state);
    case UPLOADING_MERGE:
      return Object.assign({}, state);
    case CREATED_PAILS:
      console.log(action.payload);
      return Object.assign({}, state, {
        pails: Object.assign({}, state.pails, action.payload)
      });
    case MERGING_BOX_TO_PAIL:
      return Object.assign({}, state);
    case CREATED_DRUM:
      return Object.assign({}, state);
    case SWAPPED_BUCKET:
      return Object.assign({}, state);
    case GOT_PAILS:
      return Object.assign({}, state, {
        pails: Object.assign({}, state.pails, action.payload)
      });
    case DATE_SET:
      console.log(action.payload);
      return Object.assign({}, state, { date: action.payload });
    default:
      return state;
  }
};
