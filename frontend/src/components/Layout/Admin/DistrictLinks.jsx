import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import './styles.css'

const DistrictLinks = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <ul className="nav">
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/district/pending/requests') ? 'active' : ''}`}
                    to="/district/pending/requests"
                >
                    <i className="fas fa-clipboard-check"></i> Pending Review
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/district/requests') ? 'active' : ''}`}
                    to="/district/requests"
                >
                    <i className="fas fa-clipboard-check"></i> Facility Requests
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/district/addition') ? 'active' : ''}`}
                    to="/district/addition"
                >
                    <i className="fas fa-plus-circle"></i> Addition Request
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/district/update') ? 'active' : ''}`}
                    to="/district/update"
                >
                    <i className="fas fa-edit"></i> Update Request
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/district/deactivation') ? 'active' : ''}`}
                    to="/district/deactivation"
                >
                    <i className="fas fa-ban"></i> Deactivation Request
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/district/status') ? 'active' : ''}`}
                    to="/district/status"
                >
                    <i className="fas fa-tasks"></i> Request Status Trackling
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/district/facilities') ? 'active' : ''}`}
                    to="/district/facilities"
                >
                    <i className="fas fa-hospital"></i> District Facilities
                </Link>
            </li>
        </ul>
    )
}

export default DistrictLinks