import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import './styles.css'

const RequestorLinks = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <ul className="nav">
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/requests') ? 'active' : ''}`}
                    to="/requests"
                >
                    <i className="fas fa-clipboard-check"></i> My Facility Requests
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/requests/addition') ? 'active' : ''}`}
                    to="/requests/addition"
                >
                    <i className="fas fa-plus-circle"></i> Addition Request
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/requests/update') ? 'active' : ''}`}
                    to="/requests/update"
                >
                    <i className="fas fa-edit"></i> Update Request
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/requests/deactivation') ? 'active' : ''}`}
                    to="/requests/deactivation"
                >
                    <i className="fas fa-ban"></i> Deactivation Request
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/requests/status') ? 'active' : ''}`}
                    to="/requests/status"
                >
                    <i className="fas fa-tasks"></i> Request Status Trackling
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/requests/facilities') ? 'active' : ''}`}
                    to="/requests/facilities"
                >
                    <i className="fas fa-hospital"></i> My Facilities
                </Link>
            </li>
        </ul>
    )
}

export default RequestorLinks