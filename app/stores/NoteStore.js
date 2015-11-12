import R from 'ramda';
import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {
  constructor(){
    this.bindActions(NoteActions);

    this.notes = [];

    this.exportPublicMethods({
      get: this.get.bind(this)
    });
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
  get(ids = []) {
    return R.reject(
      R.isEmpty,
      ids.map((id) => R.find(R.propEq('id', id), this.notes))
    );
  }
}

export default alt.createStore(NoteStore, 'NoteStore');
