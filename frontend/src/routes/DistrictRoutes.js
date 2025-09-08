import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import AdminLayout from '../components/Layout/Admin';
import FacilityRequests from '../pages/District/FacilityRequests';
import FacilityAddition from '../pages/District/FacilityAddition';
import DistrictRequests from '../pages/District/DistrictRequests';
import DistrictMyRequests from '../pages/District/FacilityRequests'
import RequestDetails from '../pages/District/RequestDetails';
import DistrictFacilities from '../pages/District/DistrictFacilities';
import StatusTrackling from '../components/Requests/StatusTrackling';
import FacilityUpdate from '../pages/District/FacilityUpdate';
import FacilityDeactivation from '../components/Requests/FacilityDeactivation';

const District = ({ component: Component, ...rest }) => {
    const isAuthenticated = localStorage.getItem('token')

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

const DistrictRoutes = () => (
    <Switch>
        <District exact path="/district" component={FacilityRequests} />
        <District exact path="/district/requests" component={DistrictMyRequests} />
        <District exact path="/district/request/:id" component={RequestDetails} />
        <District exact path="/district/pending/requests" component={DistrictRequests} />
        <District exact path="/district/addition" component={FacilityAddition} />
        <District exact path="/district/status" component={StatusTrackling} />
        <District exact path="/district/facilities" component={DistrictFacilities} />
        <District exact path="/district/update" component={FacilityUpdate} />
        <District exact path="/district/deactivation" component={FacilityDeactivation} />
    </Switch>
);

export default DistrictRoutes;