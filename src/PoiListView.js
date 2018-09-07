import React from 'react';

class PoiListView extends React.Component {

  handleClick(event, index){

    var marker = this.props.markers[index]

    var infoWindow = new window.google.maps.InfoWindow({
      content:this.props.contents[index]
    })
    infoWindow.open(this.props.map,marker)
    marker.setAnimation(window.google.maps.Animation.BOUNCE)    
    setTimeout(function(){ marker.setAnimation(null); }, 2*750);
  }
  
  render() {
    return (
        <ul id="list">
      {this.props.pois.map((poi, index) => <li class="poi" onClick = {(e) => this.handleClick(e, index)} >{poi}</li>)}   
      </ul>          
    );
  }
}

export default PoiListView;