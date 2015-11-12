import R from 'ramda';
import uuid from 'node-uuid';
import alt from '../libs/alt';
import LaneActions from '../actions/LaneActions';
import NoteStore from './NoteStore';

class LaneStore {
  constructor(){
    this.bindActions(LaneActions);

    this.lanes = [];
  }
  create(lane) {
    lane.id = uuid.v4();
    lane.notes = lane.notes || [];

    this.setState({
      lanes: R.append(lane, this.lanes)
    });
  }
  update({id, name}) {
    const lanes = this.lanes;
    const laneId = R.findIndex(R.propEq('id', id), lanes);

    if (laneId < 0) {
      return;
    }

    this.setState({
      lanes: R.adjust(R.assoc('name', name), laneId, lanes)
    });
  }
  delete(id) {
    const lanes = this.lanes;
    const laneId = R.findIndex(R.propEq('id', id), lanes);

    if (laneId < 0) {
      return;
    }

    this.setState({
      lanes: R.remove(laneId, 1, lanes)
    });
  }
  attachToLane({laneId, noteId}) {
    if (!noteId) {
      this.waitFor(NoteStore);
      noteId = R.prop('id', R.last(NoteStore.getState().notes));
    }

    const lanes = this.lanes;
    const laneIndex = R.findIndex(R.propEq('id', laneId), lanes);

    if (laneIndex < 0) {
      return;
    }

    const lane = lanes[laneIndex];

    if (R.indexOf(noteId, lane.notes) === -1) {
      lane.notes = R.append(noteId, lane.notes);
      this.setState({lanes});
    } else {
      console.warn('Already attached note to lane', lanes);
    }
  }
  detachFromLane({laneId, noteId}) {
    const lanes = this.lanes;
    const laneIndex = R.findIndex(R.propEq('id', laneId), lanes);

    if (laneIndex < 0) {
      return;
    }

    const lane = lanes[laneIndex];
    const notes = lane.notes;
    const noteIndex = R.indexOf(noteId, notes);

    if (noteIndex !== -1) {
      lane.notes = R.remove(noteIndex, 1, notes);
      this.setState({lanes});
    } else {
      console.warn('Failed to remove note from a lane as it didn\'t exist', lanes);
    }
  }
}

export default alt.createStore(LaneStore, 'LaneStore');
