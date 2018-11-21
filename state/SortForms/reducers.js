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
  DATE_SET,
  PAIL_WEIGHTS,
  GOT_SETTINGS,
  FAILED_TO_GET_SETTINGS
} from './types';
const INITIAL_STATE = {
  settings: {},
  forms: [],
  fetching: false,
  pails: {},
  drumId: '',
  dateStart: '2018-01-01',
  dateEnd: '2018-12-31',
  pailWeights: {},
  pailListener: () => {},
  noSettings: false
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
      return Object.assign({}, state, {
        [action.payload.dateType]: action.payload.date
      });
    case PAIL_WEIGHTS:
      return Object.assign({}, state, {
        pailWeights: action.payload.weights,
        pailListener: action.payload.listener
      });
    case GOT_SETTINGS:
      return Object.assign({}, state, {
        settings: action.payload,
        noSettings: false
      });
    case FAILED_TO_GET_SETTINGS:
      return Object.assign({}, state, { noSettings: true });
    default:
      return state;
  }
};
