import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PublicLayout from '../components/Layout/Public';

import Home from '../pages/Public/Home';
import Manuals from '../pages/Public/Manuals';
import Login from '../pages/Public/Login';
import Registration from '../pages/Public/Registration';
import FacilityList from '../pages/Public/FacilityList';
import FacilityDetails from '../pages/Public/FacilityDetails';
import VerifyCode from '../pages/Public/Registration/VerifyCode';
import ForgotPassword from '../pages/Public/ForgotPassword';
import ResetPassword from '../pages/Public/ResetPassword';

const PublicRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => (
            <PublicLayout>
                <Component {...props} />
            </PublicLayout>
        )}
    />
);

const PublicRoutes = () => (
    <Switch>
        <PublicRoute exact path="/" component={Home} />
        <PublicRoute exact path="/login" component={Login} />
        <PublicRoute exact path="/manuals" component={Manuals} />
        <PublicRoute exact path="/register" component={Registration} />
        <PublicRoute exact path="/verify" component={VerifyCode} />
        <PublicRoute exact path="/forgot-password" component={ForgotPassword} />
        <PublicRoute exact path="/reset-password/:token" component={ResetPassword} />
        <PublicRoute exact path="/facilities" component={FacilityList} />
        <PublicRoute exact path="/facility/:id" component={FacilityDetails} />
    </Switch>
);

export default PublicRoutes;