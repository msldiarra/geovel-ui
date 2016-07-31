import React from 'react';
import Relay from 'react-relay';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import _ from "lodash";
import canUseDOM from "can-use-dom";
import { default as ScriptjsLoader } from "react-google-maps/lib/async/ScriptjsLoader";
import { GoogleMap, Marker } from "react-google-maps";
import { triggerEvent } from "react-google-maps/lib/utils";


/*
 * This is the modify version of:
 * https://developers.google.com/maps/documentation/javascript/examples/event-arguments
 *
 * Loaded using async loader.
 */
 class CarPositions extends React.Component {

     static version = Math.ceil(Math.random() * 22);

     state = {
        markers: [],
     }

     constructor(props, context) {
         super(props, context);
         //this.handleWindowResize = _.throttle(::this.handleWindowResize, 500);
     }

     componentDidMount() {

        if (!canUseDOM) {
            return;
        }

        let { markers } = this.state;

        this.props.customer.cars.edges.map(function (edge) {

            if (edge.node.location)
                markers.push({
                    position: {lat: edge.node.location.latitude, lng: edge.node.location.longitude},
                    label: edge.node.reference,
                    map: this.state.map
                })

        }.bind(this));

        this.setState({markers: markers});

        //window.addEventListener(`resize`, this.handleWindowResize);
     }


     componentWillUnmount() {
         if (!canUseDOM) {
             return;
         }
         //window.removeEventListener(`resize`, this.handleWindowResize);
     }

     handleMarkerRightclick(index, event) {

        let { markers } = this.state;
        markers = markers;
        this.setState({ markers });
     }

     handleNewBehaviorGoogleMapLoad(googleMap) {
        if (!googleMap) {
            return;
        }
     }

     handleWindowResize() {
         console.log(`handleWindowResize`);
         triggerEvent(this._googleMapComponent, `resize`);
     }


     renderNewBehavior() {

        return (
            <ScriptjsLoader
                hostname={"maps.googleapis.com"}
                pathname={"/maps/api/js"}
                query={{ key:"AIzaSyDNZ5o4qepOVtmqmJlD5gHeuL-v3W2VVAA", libraries: `geometry,drawing,places` }}
                loadingElement={
          <div {...this.props} style={{ height: `100%` }}>

          </div>
        }
                containerElement={
          <div {...this.props} style={{ height: `700px` }} />
        }
                googleMapElement={
          <GoogleMap
            ref={::this.handleNewBehaviorGoogleMapLoad}
            defaultZoom={6}
            defaultCenter={{lat:17.570692, lng: -3.996166}}
            onClick={() => {}}
          >
            {this.state.markers.map((marker, index) => {
              const onRightclick = this.handleMarkerRightclick.bind(this, index);
              return (
                <Marker key={index}
                  {...marker}
                  onRightclick={onRightclick}
                />
              );
            })}
          </GoogleMap>
        }
            />
        );
     }

     render() {
        return this.renderNewBehavior();
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