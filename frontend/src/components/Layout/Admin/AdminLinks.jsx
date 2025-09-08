import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import './styles.css'

const AdminLinks = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <ul className="nav">
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                    to="/admin/dashboard"
                >
                    <i className="fas fa-tachometer-alt"></i> Dashboard
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/admin/facilityrequests') ? 'active' : ''}`}
                    to="/admin/facilityrequests"
                >
                    <i className="fas fa-clipboard-check"></i> Review Requests
                </Link>
            </li>
            <li className="nav-item dropdown">
                <span
                    className={`nav-link dropdown-toggle ${isActive('/admin/direct/addition') || isActive('/admin/direct/update') || isActive('/admin/direct/deactivation') ? 'active' : ''}`}
                    role="button"
                    tabIndex={0}
                >
                    <i className="fas fa-building"></i> Direct Facility Actions <i className="fas fa-caret-down caret-icon" aria-hidden="true"></i>
                </span>
                <ul className="dropdown-menu">
                    <li>
                        <Link className={`dropdown-item ${isActive('/admin/direct/addition') ? 'active' : ''}`} to="/admin/direct/addition">
                            Direct Facility Addition
                        </Link>
                    </li>
                    <li>
                        <Link className={`dropdown-item ${isActive('/admin/direct/update') ? 'active' : ''}`} to="/admin/direct/update">
                            Direct Facility Update
                        </Link>
                    </li>
                    <li>
                        <Link className={`dropdown-item ${isActive('/admin/direct/deactivation') ? 'active' : ''}`} to="/admin/direct/deactivation">
                            Direct Facility Deactivation
                        </Link>
                    </li>
                    <li>
                        <Link className={`dropdown-item ${isActive('/admin/services') ? 'active' : ''}`} to="/admin/services">
                            Services
                        </Link>
                    </li>
                </ul>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/admin/mfl') ? 'active' : ''}`}
                    to="/admin/mfl"
                >
                    <i className="fas fa-building"></i> Master Facility List
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/admin/units') ? 'active' : ''}`}
                    to="/admin/units"
                >
                    <i className="fas fa-sitemap"></i> Organisation Units
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/admin/levels') ? 'active' : ''}`}
                    to="/admin/levels"
                >
                    <i className="fas fa-layer-group"></i> Admin Levels
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}
                    to="/admin/users"
                >
                    <i className="fas fa-users"></i> Users
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/admin/systems') ? 'active' : ''}`}
                    to="/admin/systems"
                >
                    <i className="fas fa-stethoscope"></i> API Systems
                </Link>
            </li>
        </ul>
    )
}

export default AdminLinks