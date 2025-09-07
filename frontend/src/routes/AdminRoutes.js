import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import AdminLayout from '../components/Layout/Admin';
import Dashboard from '../pages/Admin/Dashboard';
import Users from '../pages/Admin/Users';
import AddUser from '../pages/Admin/Users/New';
import AdminUnits from '../pages/Admin/AdminUnits';
import AdminLevels from '../pages/Admin/AdminLevels';
import FacilityRequests from '../pages/Admin/FacilityRequests';
import FacilityDetails from '../pages/Admin/FacilityDetails';
import AdditionRequest from '../pages/Admin/AdditionRequest';
import MasterFacilityList from '../pages/Admin/MFL';
import RequestDetails from '../pages/Admin/FacilityRequests/Details';


const ProtectedAdminRoute = ({ component: Component, ...rest }) => {
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

const AdminRoutes = () => (
    <Switch>
        <ProtectedAdminRoute exact path="/admin/users" component={Users} />
        <ProtectedAdminRoute exact path="/admin/users/new" component={AddUser} />
        <ProtectedAdminRoute exact path="/admin/dashboard" component={Dashboard} />
        <ProtectedAdminRoute exact path="/admin/units" component={AdminUnits} />
        <ProtectedAdminRoute exact path="/admin/levels" component={AdminLevels} />
        <ProtectedAdminRoute exact path="/admin/facilityrequests" component={FacilityRequests} />
        <ProtectedAdminRoute exact path="/admin/request/:id" component={RequestDetails} />
        <ProtectedAdminRoute exact path="/admin/additionrequest" component={AdditionRequest} />
        <ProtectedAdminRoute exact path="/admin/mfl" component={MasterFacilityList} />
        <ProtectedAdminRoute exact path="/admin/mfl/:id" component={FacilityDetails} />
        <Route path="*">
            <h2>404 - Page Not Found</h2>
        </Route>
    </Switch>
);

export default AdminRoutes;