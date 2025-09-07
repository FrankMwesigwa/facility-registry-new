import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PublicRoutes from './PublicRoutes';
import AdminRoutes from './AdminRoutes';
import RequestorRoutes from './RequestorRoutes';
import DistrictRoutes from './DistrictRoutes';
import PlanningRoutes from './PlanningRoutes';

const App = () => {
    return (
        <Router>
            <ToastContainer />
            <Switch>
                <Route path="/admin">
                    <AdminRoutes />
                </Route>
                <Route path="/requests">
                    <RequestorRoutes />
                </Route>
                <Route path="/district">
                    <DistrictRoutes />
                </Route>
                <Route path="/planning">
                    <PlanningRoutes />
                </Route>
                <Route path="/">
                    <PublicRoutes />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;