import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import PoiListView from './PoiListView'

class App extends Component {
  
  state = {
    venues:[],
    dataSource:[],
    markers: [],
    contents: [],
    filteredMarkers: [],
    filteredContent: [],
    filteredNames: [],
    query:"coffee"
  }
  componentDidMount() {
    this.getPois()
    
  }
  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCICeC_ORdINHfDr3jHcI6SG6e-dWLsZdw&callback=initMap")
    window.initMap = this.initMap
  }

  getPois = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const params = {
      client_id : "5NVRGM3PV2HW01JF3VDQQYLPEKIDS1TIEZQZ5KS3WDMTTTD0",
      client_secret: "ACXHRVLBN1C3K4OCXQDBXVSMU3GUKB0MHMZIHSOLXWJ225LV",
      query: this.state.query,
      near: "providence",
      v: "20180901"
    }

    axios.get(endPoint + new URLSearchParams(params)).then(response => {
      console.log(response.data.response.groups[0].items)
      this.setState({
        venues:response.data.response.groups[0].items,
        dataSource:response.data.response.groups[0].items.map(poi => poi.venue.name)
      }, this.renderMap())
    }).catch(error => {
      console.log(error)
    })

  }

  initMap = () => {
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 41.8240, lng: -71.4128},
      zoom: 14
    });    
    this.state.map = map

    this.state.venues.map(poi => {
      console.log(poi)
            
      var marker = new window.google.maps.Marker({
        position: {lat:poi.venue.location.lat,lng:poi.venue.location.lng },
        map:map,
        title:poi.venue.name
      })

      this.state.markers.push(marker)
      var content = '<h3>Name: ' + poi.venue.name + '</h3>' +
                   ' <p>Address: ' + poi.venue.location.address +
                   ' <p>Lat/long: ' + poi.venue.location.lat + ', ' + poi.venue.location.lng + '</p>';
      this.state.contents.push(content)
      var infoWindow = new window.google.maps.InfoWindow({
        content:content
      })
      marker.addListener('click', () => {
        infoWindow.open(map,marker)
        marker.setAnimation(window.google.maps.Animation.BOUNCE)        
        setTimeout(function(){ marker.setAnimation(null); }, 2*750);
      })

    })
    this.setState(
      {
    filteredContent: this.state.contents,
    filteredMarkers : this.state.markers,
    filteredNames : this.state.dataSource
      }
    )

   console.log(this.state.filteredNames)
    
  }

  handleInputChange = () => {
    if (this.search.value.length ===0){
      return
    }
    
    var fNames = []
    var fContent = []
    var fMarkers = []
    this.state.contents.filter((content, index)=>{
      var shouldConsider = content.indexOf(this.search.value) !== -1
      if (shouldConsider){
        fContent.push(content)
        fMarkers.push(this.state.markers[index])
        this.state.markers[index].setMap(this.state.map)
        fNames.push(this.state.dataSource[index])
      }
      else{
        this.state.markers[index].setMap(null)
      }

    })
    this.setState(
      {
    filteredContent: fContent,
    filteredMarkers : fMarkers,
    filteredNames : fNames
      }
    )
  }

  render() {
    return (
      <main>  
        <input
          placeholder=""
          ref={input => this.search = input}
          onChange={this.handleInputChange}
        />
        <div id="leftcolumn">
          <PoiListView pois={this.state.filteredNames} markers={this.state.filteredMarkers} map={this.state.map} contents={this.state.filteredContent}></PoiListView>      
        </div>
        <div id="map"></div>
      </main>
    );
  }
}

function loadScript(url) {
  var index  = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defere = true
  index.parentNode.insertBefore(script, index)
  
}

export default App;
