import R from 'ramda';
import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {
  constructor(){
    this.bindActions(NoteActions);

    this.notes = [];
  }
  create(note) {
    note.id = uuid.v4();

    this.setState({
      notes: R.append(note, this.notes)
    });
  }
  update({id, task}) {
    this.setState({
      notes: R.adjust(R.assoc('task', task), R.findIndex(R.propEq('id', id), this.notes), this.notes)
    });
  }
  delete(id) {
    this.setState({
      notes: R.remove(R.findIndex(R.propEq('id', id), this.notes), 1, this.notes)
    });
  }
}

export default alt.createStore(NoteStore, 'NoteStore');
