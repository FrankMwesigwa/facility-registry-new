import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import AdminLayout from '../components/Layout/Admin';
import MyFacilities from '../pages/Requestor/MyFacilities';
import StatusTrackling from '../components/Requests/StatusTrackling';
import FacilityUpdate from '../pages/Requestor/FacilityUpdate';
import FacilityDetail from '../pages/Requestor/FacilityDetails';
import FacilityRequests from '../pages/Requestor/FacilityRequests';
import FacilityAddition from '../pages/Requestor/FacilityAddition';
import FacilityDeactivation from '../components/Requests/FacilityDeactivation';

const Requestor = ({ component: Component, ...rest }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    <AdminLayout>
                        <Component {...props} />
                    </AdminLayout>
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />
                )
            }
        />
    );
};

const RequestorRoutes = () => (
    <Switch>
        <Requestor exact path="/requests" component={FacilityRequests} />
        <Requestor exact path="/requests/status" component={StatusTrackling} />
        <Requestor exact path="/requests/facilities" component={MyFacilities} />
        <Requestor exact path="/requests/mfl/:id" component={FacilityDetail} />
        <Requestor exact path="/requests/update" component={FacilityUpdate} />
        <Requestor exact path="/requests/addition" component={FacilityAddition} />
        <Requestor exact path="/requests/deactivation" component={FacilityDeactivation} />
    </Switch>
);

export default RequestorRoutes;