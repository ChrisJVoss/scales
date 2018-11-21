import {
  GETTING_SORT_FORMS,
  GOT_SORT_FORMS,
  UPLOAD_SUCCESSFUL,
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
import firebase from 'firebase';
import { Firestore } from '../../config.js';

export const setDate = (dateType, date) => {
  return { type: DATE_SET, payload: { dateType, date } };
};

export const getSettings = machineId => {
  return dispatch => {
    let settings = {};
    Firestore.collection('Admin')
      .where('Machines', 'array-contains', machineId)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let data = doc.data();
          settings.chemistries = data.Chemistries;
          settings.units = data.Units;
        });
        console.log(settings);
        if (
          Object.keys(settings).length === 0 &&
          settings.constructor === Object
        ) {
          console.log('no settings');
          dispatch({ type: FAILED_TO_GET_SETTINGS });
        } else {
          dispatch({ type: GOT_SETTINGS, payload: settings });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const getSortForms = (dateStart, dateEnd) => {
  console.log('called');
  return dispatch => {
    dispatch({ type: GETTING_SORT_FORMS });
    const timeStart = Date.parse(dateStart) / 1000;
    const timestampStart = new firebase.firestore.Timestamp(timeStart, 0);
    const timeEnd = Date.parse(dateEnd) / 1000;
    const timestampEnd = new firebase.firestore.Timestamp(timeEnd, 0);
    let forms = [];
    Firestore.collection('BoxDocuments')
      .where('SortedOn', '>=', timestampStart)
      .where('SortedOn', '<=', timestampEnd)
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
              Boxes: firebase.firestore.FieldValue.arrayUnion.apply(
                null,
                data.Boxes
              ),
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
/*
export const getChemistries = () => {
  return dispatch => {

  }
}
*/

export const getPailWeights = machineId => {
  return dispatch => {
    let weights = {};
    const listener = Firestore.collection('PailDocuments')
      .where('Completed', '==', false)
      .where('MachineId', '==', machineId)
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          let data = doc.data();
          let weight = data.Boxes.reduce((acc, cV) => acc + cV.Weight, 0);
          weights[data.Chemistry] = weight.toFixed(2);
        });
        dispatch({ type: PAIL_WEIGHTS, payload: { weights, listener } });
      });
  };
};
