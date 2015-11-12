import R from 'ramda';
import React from 'react';
import Lane from './Lane.jsx';

export default class Lanes extends React.Component {
  // constructor(props) {
  //   super(props);
  //
  //   this.renderLane = this.renderLane.bind(this);
  // }
  render() {
    const lanes = this.props.items;
    return (
      <div className="lanes">
        {R.map(this.renderLane, lanes)}
      </div>
    );
  }
  renderLane(lane) {
    return <Lane className="lane" key={lane.id} lane={lane} />;
  }
}
