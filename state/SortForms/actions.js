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
import firebase from 'firebase';
import { Firestore } from '../../config.js';

export const setDate = date => {
  return { type: DATE_SET, payload: date };
};

export const getSortForms = date => {
  console.log('called');
  return dispatch => {
    dispatch({ type: GETTING_SORT_FORMS });
    const time = Date.parse(date) / 1000;
    const timestamp = new firebase.firestore.Timestamp(time, 0);
    console.log(timestamp);
    let forms = [];
    Firestore.collection('BoxDocuments')
      .where('SortedOn', '==', timestamp)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          forms.push(doc.data());
        });
        console.log(forms);
        dispatch({ type: GOT_SORT_FORMS, payload: forms });
      })
      .catch(err => console.error(err));
  };
};

export const uploadBox = box => {
  console.log(box);
  return dispatch => {
    Firestore.collection('BoxDocuments')
      .add(Object.assign({}, box))
      .then(docRef => {
        console.log('successful write ', docRef);
        dispatch({ type: UPLOAD_SUCCESSFUL });
      })
      .catch(err => console.log('there was an error', err));
  };
};

export const mergeBoxIntoPails = (box, pailIds) => {
  console.log(box, pailIds);
  return dispatch => {
    dispatch({ type: MERGING_BOX_TO_PAIL });
    for (let chemistry in box.Contents) {
      console.log();
      Firestore.collection('PailDocuments')
        .doc(pailIds[chemistry])
        .update({
          Boxes: firebase.firestore.FieldValue.arrayUnion({
            BoxId: box.BoxId,
            Weight: box.Contents[chemistry]
          })
        })
        .then(() => console.log('successfuly merged box!'));
    }
  };
};

export const createPail = (chemistries, machineId) => {
  return dispatch => {
    chemistries.forEach(chemistry => {
      Firestore.collection('PailDocuments')
        .add({
          MachineId: machineId,
          Completed: false,
          Chemistry: chemistry,
          Boxes: [],
          DrumId: null
        })
        .then(docRef =>
          dispatch({
            type: CREATED_PAILS,
            payload: { [chemistry]: docRef.id }
          })
        )
        .catch(err => console.log(err));
    });
  };
};

export const swapBucket = (pailRef, drumId, machineId) => {
  console.log(pailRef, drumId);
  return dispatch => {
    Firestore.collection('PailDocuments')
      .doc(pailRef)
      .get()
      .then(doc => {
        let data = doc.data();
        console.log(data);
        Firestore.collection('DrumDocuments')
          .doc(drumId)
          .set(
            {
              Boxes: data.Boxes,
              DrumId: drumId
            },
            { merge: true }
          )
          .then(docRef => {
            console.log(`Succesfully added ${pailRef} to drum: ${drumId}`);
            Firestore.collection('PailDocuments')
              .doc(pailRef)
              .update({
                Completed: true
              })
              .then(() => {
                console.log('successfully updated pail');
                dispatch(createPail([data.Chemistry], machineId));
              });
            dispatch({ type: SWAPPED_BUCKET });
          });
      });
  };
};

export const createDrum = drumId => {
  return dispatch => {
    Firestore.collection('DrumDocuments')
      .add({
        DrumId: drumId,
        Boxes: []
      })
      .then(docRef => dispatch({ type: CREATED_DRUM }));
  };
};

export const getPails = (machineId, chemistries) => {
  return dispatch => {
    let pails = {};
    Firestore.collection('PailDocuments')
      .where('Completed', '==', false)
      .where('MachineId', '==', machineId)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let data = doc.data();
          pails[data.Chemistry] = doc.id;
        });
        let missingChems = [];
        chemistries.forEach(chem => {
          if (!pails.hasOwnProperty(chem)) {
            missingChems.push(chem);
          }
        });
        if (missingChems.length > 0) {
          dispatch(createPail(missingChems, machineId));
        }
        dispatch({ type: GOT_PAILS, payload: pails });
      });
  };
};
