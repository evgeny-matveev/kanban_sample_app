import R from 'ramda';
import uuid from 'node-uuid';
import alt from '../libs/alt';
import LaneActions from '../actions/LaneActions';

class LaneStore {
  constructor(){
    this.bindActions(LaneActions);

    this.lanes = [];
  }
  create(lane) {
    lane.id = uuid.v4();

    this.setState({
      lanes: R.append(lane, this.lanes)
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

    if (R.contains(noteId, lane.notes)) {
      R.append(noteId, lane.notes);
      this.setState({lanes});
    } else {
      console.warn('Already attached note to lane', lanes);
    }
  }
  detachFromLane({laneId, noteId}) {

    //  W I P

    const lanes = this.lanes;
    const laneIndex = R.findIndex(R.propEq('id', laneId), lanes);

    if (laneIndex < 0) {
      return;
    }

    const lane = lanes[laneIndex];
    const notes = lane.notes;
    const removeIndex = notes.indexOf(noteId);

    if (removeIndex !== -1) {
      lane.notes = notes.slice(0, removeIndex).
        concat(notes.slice(removeIndex + 1));

      this.setState({lanes});
    }
    else {
      console.warn('Failed to remove note from a lane as it didn\'t exist', lanes);
    }
  }
}

export default alt.createStore(LaneStore, 'LaneStore');
