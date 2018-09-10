import React from 'react';

const PoiListView = ({ state: { pois, map, filteredPois } }) => {

  function handleClick(event, poi) {

    const item = pois.get(poi)
    const { marker, infoWindow, map } = item
    // close all info windows first
    pois.forEach((poi) => poi.infoWindow.close())
    infoWindow.open(map, marker)
    marker.setAnimation(window.google.maps.Animation.BOUNCE)
    setTimeout(() => {
      marker.setAnimation(null);
    }, 2 * 750);
  }
  return (
    <div id="list">
      {filteredPois.map((poi) =>
        <div role="button" tabindex="0" 
          className="poi"
          key={poi}
          onClick={(event) => handleClick(event, poi)}>
          {poi}
        </div>
      )}
      <div>
        <img src={require('./fourSquare.png')} alt="Powered by Foursquare" />
      </div>
    </div>
  );
}

export default PoiListView;
