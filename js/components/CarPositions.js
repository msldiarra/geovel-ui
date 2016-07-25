import React from 'react';
import Relay from 'react-relay';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class CarPositions extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            initialZoom: 8,
            mapCenterLat: 43.6425569,
            mapCenterLng: -79.4073126,
        }
    }


    componentDidMount() {

        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat:17.570692, lng: -3.996166},
            streetViewControl: false,
            disableDefaultUI: true,
            zoom: 6
        });

        //map.setOptions({styles: styleArray })

        this.setState({map: map});
    }


    render() {



         this.props.customer.cars.edges.map(function(edge){

             if(edge.node.location)
                 new google.maps.Marker({
                     position: {lat:edge.node.location.latitude, lng: edge.node.location.longitude},
                     label: edge.node.reference,
                     map: this.state.map
                 });

         }.bind(this));

        /*
        new google.maps.Marker({
            position: {lat:17.570692, lng: -3.996166},
            label: 'A00001',
            map: this.state.map
        });*/



        /*
        * <div className="">
         <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
         <div id="map"></div>
         </ReactCSSTransitionGroup>
         </div>*/
        return (<div id="map-container"><div id="map"></div></div>);
    }
}

export default Relay.createContainer(CarPositions, {
    fragments: {
        customer: () => Relay.QL`
          fragment on User {
            id
            cars(first: 100) {
              edges {
                node {
                  id
                  reference
                  location {
                    latitude
                    longitude
                  }
                }
              }
            }
          }
    `
    }
});