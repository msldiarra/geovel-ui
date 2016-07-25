import React from 'react';
import Relay from 'react-relay';
import AuthenticatedComponent from './AuthenticatedComponent';
import CarPositions from './CarPositions';

class Dashboard extends React.Component {

    render() {
        return (
            <div>
                <div className="page-header">
                    <h2>Vos véhicules</h2>
                </div>
                <CarPositions customer={this.props.viewer} />
            </div>
        );
    }
}

export default Relay.createContainer(Dashboard, {

    fragments: {
        viewer: () => Relay.QL`
          fragment on User {
               id
               ${CarPositions.getFragment('customer')}
          }
    `,
    }

});