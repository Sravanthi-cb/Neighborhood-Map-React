import React from 'react';

class PoiListView extends React.Component {

  handleClick(event, poi){
    
    let item = this.props.state.pois.get(poi)
    let marker = item.marker
    let infoWindow = item.infoWindow
    infoWindow.open(this.props.state.map, marker)
    marker.setAnimation(window.google.maps.Animation.BOUNCE)    
    setTimeout(function(){ marker.setAnimation(null); }, 2*750);
  }
  
  render() {
    return (
        <div id="list">
          {this.props.state.filteredPois.map((poi) => <div className="poi" key={poi} onClick = {(e) => this.handleClick(e, poi)}>{poi}</div>)}   
        </div>          
    );
  }
}

export default PoiListView;