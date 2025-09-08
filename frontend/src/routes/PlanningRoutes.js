import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import AdminLayout from '../components/Layout/Admin';
import MasterFacilityList from '../pages/Planning/MFL';
import FacilityRequests from '../pages/Planning/FacilityRequests';
import RequestDetails from '../pages/Planning/RequestDetails';
import FacilityDetails from '../pages/Planning/FacilityDetails';

const Planning = ({ component: Component, ...rest }) => {
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

const PlanningRoutes = () => (
    <Switch>
        <Planning exact path="/planning/requests" component={FacilityRequests} />
        <Planning exact path="/planning/mfl" component={MasterFacilityList} />
        <Planning exact path="/planning/mfl/:id" component={FacilityDetails} />
        <Planning exact path="/planning/request/:id" component={RequestDetails} />
    </Switch>
);

export default PlanningRoutes;