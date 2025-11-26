import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import AdminLayout from '../components/Layout/Admin';
import Dashboard from '../pages/Admin/Dashboard';

import MasterFacilityList from '../pages/Admin/MFL';
import Users from '../pages/Admin/Users';
import Systems from '../pages/Admin/Systems';
import NewSystem from '../pages/Admin/Systems/New';
import Services from '../pages/Admin/Services';
import AddUser from '../pages/Admin/Users/New';
import AdminUnits from '../pages/Admin/AdminUnits';
import AdminLevels from '../pages/Admin/AdminLevels';
import FacilityRequests from '../pages/Admin/FacilityRequests';
import FacilityDetails from '../pages/Admin/FacilityDetails';
import AdditionRequest from '../pages/Admin/AdditionRequest';

import RequestDetails from '../pages/Admin/FacilityRequests/Details';
import FacilityUpdate from '../pages/Admin/DirectActions/FacilityUpdate';
import FacilityAddition from '../pages/Admin/DirectActions/FacilityAddition'
import FacilityDeactivation from '../pages/Admin/DirectActions/FacilityDeactivation';

const ProtectedAdminRoute = ({ component: Component, ...rest }) => {
    const isAuthenticated = localStorage.getItem('token')

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    <AdminLayout>
                        <Component {...props} {...rest} />
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
        <ProtectedAdminRoute exact path="/admin/systems" component={Systems} />
        <ProtectedAdminRoute exact path="/admin/services" component={Services} />
        <ProtectedAdminRoute exact path="/admin/systems/new" component={NewSystem} />
        <ProtectedAdminRoute exact path="/admin/users/new" component={AddUser} />
        <ProtectedAdminRoute exact path="/admin/dashboard" component={Dashboard} />
        <ProtectedAdminRoute exact path="/admin/units" component={AdminUnits} />
        <ProtectedAdminRoute exact path="/admin/levels" component={AdminLevels} />
        <ProtectedAdminRoute exact path="/admin/direct/addition" component={FacilityAddition} url="facilityrequests" link="admin/facilityrequests" />
        <ProtectedAdminRoute exact path="/admin/direct/update" component={FacilityUpdate} url="facilityrequests" link="admin/facilityrequests" />
        <ProtectedAdminRoute exact path="/admin/direct/deactivation" component={FacilityDeactivation} />
        <ProtectedAdminRoute exact path="/admin/facilityrequests" component={FacilityRequests} />
        <ProtectedAdminRoute exact path="/admin/request/:id" component={RequestDetails} />
    <ProtectedAdminRoute exact path="/admin/additionrequest" component={AdditionRequest} url="facilityrequests" link="admin/facilityrequests" />
        <ProtectedAdminRoute exact path="/admin/mfl" component={MasterFacilityList} />
        <ProtectedAdminRoute exact path="/admin/mfl/:id" component={FacilityDetails} />
        <Route path="*">
            <h2>404 - Page Not Found</h2>
        </Route>
    </Switch>
);

export default AdminRoutes;