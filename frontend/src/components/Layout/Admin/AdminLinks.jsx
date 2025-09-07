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
                    <i className="fas fa-clipboard-check"></i> Facility Requests
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/admin/mfl') ? 'active' : ''}`}
                    to="/admin/mfl"
                >
                    <i className="fas fa-building"></i> MFL
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className={`nav-link ${isActive('/admin/units') ? 'active' : ''}`}
                    to="/admin/units"
                >
                    <i className="fas fa-sitemap"></i> Admin Units
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
                    className={`nav-link ${isActive('/admin/services') ? 'active' : ''}`}
                    to="/admin/services"
                >
                    <i className="fas fa-stethoscope"></i> Services
                </Link>
            </li>
        </ul>
    )
}

export default AdminLinks