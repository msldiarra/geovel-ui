import React from 'react'
import ReactDOM from 'react-dom'

class CarMap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            initialZoom: 8,
            mapCenterLat: 43.6425569,
            mapCenterLng: -79.4073126,
        }
    }

    componentDidMount() {

        var styleArray = [
            {
                featureType: "all",
                stylers: [
                    { saturation: -80 }
                ]
            },{
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [
                    { hue: "#00ffee" },
                    { saturation: 50 }
                ]
            },{
                featureType: "poi.business",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ]

        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            streetViewControl: false,
            disableDefaultUI: true,
            zoom: 3
        });

        new google.maps.Marker({
            position: {lat: -34.397, lng: 150.644},
            label: 'A00001',
            map: map
        });

        map.setOptions({styles: styleArray })

        this.setState({map: map});
    }


    render() {

        return  <div id="map"></div>
    }
}


export default MainMap