import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import PoiListView from './PoiListView';
import { Container, Row, Col } from 'reactstrap';


// App component that handles the initialization and filtering
// The app specifically looks for coffee shops near Providence neighborhood
// These points of interest (pois) are then obtained using the FourSquare API and axios
// It uses the google maps API to display these pois

const neighborhood = {
  name: 'Providence',
  lat: 41.8240,
  lng: -71.4128,
  query: 'coffee'
}

const keys = {
  fourSquare: {
    api: "https://api.foursquare.com/v2/venues/explore?",
    client_id: "5NVRGM3PV2HW01JF3VDQQYLPEKIDS1TIEZQZ5KS3WDMTTTD0",
    client_secret: "ACXHRVLBN1C3K4OCXQDBXVSMU3GUKB0MHMZIHSOLXWJ225LV"
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pois: [],
      filteredPois: [],
      map: null
    };
  }

  componentDidMount() {
    this.getPois()

  }
  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCICeC_ORdINHfDr3jHcI6SG6e-dWLsZdw&callback=initMap")
    window.initMap = this.initMap
  }

  // method to get the points of interest using the FourSquare API and axios
  getPois = () => {

    const endPoint = keys.fourSquare.api;
    const params = {
      client_id: keys.fourSquare.client_id,
      client_secret: keys.fourSquare.client_secret,
      query: neighborhood.query,
      near: neighborhood.name,
      v: "20180901"
    }

    axios.get(endPoint + new URLSearchParams(params)).then(response => {
      let venues = response.data.response.groups[0].items.slice(0, 10)
      let pois = new Map()
      venues.forEach(item => {

        let name = item.venue.name
        let val = {
          venue: item.venue,
          marker: null,
          infoWindow: null
        }
        pois.set(name, val)
      })

      // set the state
      this.setState({
        pois: pois
      }, this.renderMap())

    }).catch(error => {
      alert(error)
    })
  }

  // Initialize the google maps
  initMap = () => {
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: neighborhood.lat, lng: neighborhood.lng },
      zoom: 14
    });

    // create markers for each poi

    this.state.pois.forEach(poi => {

      var marker = new window.google.maps.Marker({
        position: { lat: poi.venue.location.lat, lng: poi.venue.location.lng },
        map: map,
        title: poi.venue.name
      })

      const content = (
        `
        <h3 tabIndex="0">Name:  ${poi.venue.name}  </h3> 
        <p tabIndex="0">Address: ${poi.venue.location.address} </p>
        <p tabIndex="0"> ${poi.venue.location.city} ${poi.venue.location.state} ${poi.venue.location.postalCode} </p>
      `
      )

      var infoWindow = new window.google.maps.InfoWindow({
        content: content
      })

      marker.addListener('click', () => {
        // close all info windows first
        this.state.pois.forEach((poi) => poi.infoWindow.close())
        infoWindow.open(map, marker)
        marker.setAnimation(window.google.maps.Animation.BOUNCE)
        setTimeout(function () { marker.setAnimation(null); }, 2 * 750); // animate it 2 times
      })

      poi.marker = marker
      poi.infoWindow = infoWindow

    })

    // initially filteredPois has the same names as pois
    this.setState({
      filteredPois: [...this.state.pois.keys()],
      map: map
    })

  }

  // handle the filtering based on the filter value
  handleInputChange = () => {

    var fNames = []

    this.state.pois.forEach((poi, value) => {
      let name = poi.venue.name
      var shouldConsider = name.indexOf(this.search.value) !== -1
      if (shouldConsider) {
        poi.marker.setMap(this.state.map)
        fNames.push(name)
      }
      else {
        poi.marker.setMap(null)
      }
    })
    this.setState({
      filteredPois: fNames
    }
    )
  }

  // render the app
  render() {
    return (
      <main>
        <Container>
          <div id="search">
            <Row>
              <Col>
                <input aria-labelledby="search"
                  id="input"
                  placeholder="Enter text to filter"
                  ref={input => this.search = input}
                  onChange={this.handleInputChange}
                />
              </Col>
            </Row>
          </div>
          <div id="content">
            <Row>
              <Col sm={{ size: 'auto', offset: 1 }}>
                <div id="leftcolumn" role="region" aria-label="filter list">
                  <PoiListView state={this.state}></PoiListView>
                </div>
              </Col>
              <Col sm={{ size: 'auto', offset: 1 }}>

                <section id="map-container" role="application" aria-label="Google Map">
                  <div id="map"></div>
                </section>
              </Col>
            </Row>
          </div>
        </Container>
      </main>
    );
  }
}

function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defere = true
  script.onerror = (error) => {    
    const msg = 'Error loading ' + error.target.src    
    alert(msg)
  }
  // define global function to handle authentication failures with google API
  window.gm_authFailure = () => { alert('Google map authentication failed.')}

  index.parentNode.insertBefore(script, index)
}

export default App;
